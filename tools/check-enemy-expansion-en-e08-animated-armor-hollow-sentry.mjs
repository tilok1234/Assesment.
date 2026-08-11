import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E01_PUBLIC_REGISTRY } from '../engine/enemy-expansion-en-e01.js';
import {
  EN_E05_REVENANT_GATE,
  EN_E05_REVENANT_REGISTRY,
} from '../engine/enemy-expansion-en-e05-revenant.js';
import {
  EN_E07_GLOAM_WALKER_GATE,
  EN_E07_GLOAM_WALKER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-living-shadow-gloam-walker.js';
import {
  EN_E07_BLACKWAKE_DREADMARE_GATE,
} from '../engine/enemy-expansion-en-e07-kelpie-blackwake-dreadmare.js';
import {
  EN_E08_ACTOR_TOPOLOGY_DECISION,
  EN_E08_ANIMATED_ARMOR_CONTRACT_CARD,
  EN_E08_HOLLOW_SENTRY_CONTRACT,
  EN_E08_HOLLOW_SENTRY_DATA,
  EN_E08_HOLLOW_SENTRY_DEATH_SOURCE_FRAMES,
  EN_E08_HOLLOW_SENTRY_FAMILY,
  EN_E08_HOLLOW_SENTRY_GATE,
  EN_E08_HOLLOW_SENTRY_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-hollow-sentry.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  mirrorPixels,
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
const candidateSpec = { kind: 'enemy', family: 'animated-armor', variant: 'hollow-sentry' };
const fallenKnightSpec = { kind: 'enemy', family: 'fallen-knight', variant: 'shieldbearer' };
const revenantSpec = { kind: 'enemy', family: 'revenant', variant: 'grave-oathkeeper' };
const gloamWalkerSpec = { kind: 'enemy', family: 'living-shadow', variant: 'gloam-walker' };

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function frameRecord(captured, spec, direction, animation, frame) {
  return {
    family: spec.family,
    variant: spec.variant,
    candidateFamily: spec.family,
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
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
  EN_E08_ACTOR_TOPOLOGY_DECISION.status === 'selected'
    && EN_E08_ACTOR_TOPOLOGY_DECISION.selected === 'baked-single-actor'
    && EN_E08_ACTOR_TOPOLOGY_DECISION.selectedOn === '2026-08-11'
    && EN_E08_ACTOR_TOPOLOGY_DECISION.baseCheckpoint === 'defc9b8cab1226610da6cf2b17951c8b5815499e'
    && EN_E08_ACTOR_TOPOLOGY_DECISION.selectionEvidence.includes('designer replied: lets do next')
    && EN_E08_ACTOR_TOPOLOGY_DECISION.selectionEvidence.includes('recommended baked single-actor topology')
    && EN_E08_ACTOR_TOPOLOGY_DECISION.childAssets.length === 0
    && EN_E08_ACTOR_TOPOLOGY_DECISION.forbidden.includes('incidental per-frame child offsets')
    && EN_E08_ACTOR_TOPOLOGY_DECISION.forbidden.includes('schema changes')
    && EN_E08_ACTOR_TOPOLOGY_DECISION.reopenRule.includes('new explicit architecture gate'),
  'EN-E08 baked single-actor architecture decision drifted',
);
check(
  EN_E08_HOLLOW_SENTRY_GATE.status === 'approved'
    && EN_E08_HOLLOW_SENTRY_GATE.baseCheckpoint === 'defc9b8cab1226610da6cf2b17951c8b5815499e'
    && EN_E08_HOLLOW_SENTRY_GATE.authorizedOn === '2026-08-11'
    && EN_E08_HOLLOW_SENTRY_GATE.authorizationEvidence.includes('designer replied: lets do next')
    && EN_E08_HOLLOW_SENTRY_GATE.authorizationEvidence.includes('exactly one private common Animated Armor Hollow Sentry')
    && EN_E08_HOLLOW_SENTRY_GATE.architectureDecision === EN_E08_ACTOR_TOPOLOGY_DECISION.id
    && EN_E08_HOLLOW_SENTRY_GATE.approvedOn === '2026-08-11'
    && EN_E08_HOLLOW_SENTRY_GATE.approvedImplementation === '914aa700b82469dbb22ca1600f1bc7ad6dbecff7'
    && EN_E08_HOLLOW_SENTRY_GATE.publicationAuthorizedOn === '2026-08-11'
    && EN_E08_HOLLOW_SENTRY_GATE.publicationState === 'approved-local',
  'Hollow Sentry authorization or approved-local publication state drifted',
);
check(
  EN_E08_HOLLOW_SENTRY_GATE.approvalEvidence.includes('designer replied: apprvoed')
    && EN_E08_HOLLOW_SENTRY_GATE.approvalEvidence.includes('Aseprite 1.3.17.2 process 6832')
    && EN_E08_HOLLOW_SENTRY_GATE.approvalEvidence.includes('f6e7cbf25692b08e2e4dfccef149662c18d195e4cf615185f7a38e4874e2b9ac')
    && EN_E08_HOLLOW_SENTRY_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E08_HOLLOW_SENTRY_GATE.publicationAuthorizationEvidence.includes('pull request'),
  'exact approval evidence or bounded publication authorization drifted',
);
check(
  EN_E08_HOLLOW_SENTRY_GATE.precedingApproval.gateId === EN_E07_BLACKWAKE_DREADMARE_GATE.id
    && EN_E08_HOLLOW_SENTRY_GATE.precedingApproval.candidateFrameDigest === EN_E07_BLACKWAKE_DREADMARE_GATE.candidateFrameDigest
    && EN_E08_HOLLOW_SENTRY_GATE.precedingApproval.publishedImplementation === EN_E07_BLACKWAKE_DREADMARE_GATE.publishedImplementation
    && EN_E08_HOLLOW_SENTRY_GATE.precedingApproval.publishedApprovalRecord === EN_E07_BLACKWAKE_DREADMARE_GATE.publishedApprovalRecord
    && EN_E08_HOLLOW_SENTRY_GATE.precedingApproval.initialPublishedHandoff === EN_E07_BLACKWAKE_DREADMARE_GATE.initialPublishedHandoff
    && EN_E08_HOLLOW_SENTRY_GATE.precedingApproval.currentReconciliation === 'defc9b8cab1226610da6cf2b17951c8b5815499e'
    && EN_E08_HOLLOW_SENTRY_GATE.precedingApproval.reconciliationPublication === 'published',
  'approved Blackwake Dreadmare predecessor drifted',
);
check(
  EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.collisionRuling.includes('Haunted Armor and Animated Armor are one animated-armor family')
    && JSON.stringify(EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.activeVariant.id === 'hollow-sentry'
    && EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.activeVariant.identity === 'haunted-default'
    && EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite'])
    && EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.actorTopology === 'baked-single-actor',
  'Animated Armor collision ruling, role order, or topology boundary drifted',
);
check(
  EN_E08_HOLLOW_SENTRY_CONTRACT.state === 'implemented-complete-motion-approved'
    && EN_E08_HOLLOW_SENTRY_CONTRACT.topology === 'baked-single-actor'
    && EN_E08_HOLLOW_SENTRY_CONTRACT.silhouette.includes('sealed low-crested helm')
    && EN_E08_HOLLOW_SENTRY_CONTRACT.silhouette.includes('oversized connected gauntlets')
    && EN_E08_HOLLOW_SENTRY_CONTRACT.silhouette.includes('armor acting as the entire body')
    && EN_E08_HOLLOW_SENTRY_CONTRACT.visualIdentity.includes('no exposed flesh')
    && EN_E08_HOLLOW_SENTRY_DATA.actorTopology === 'baked-single-actor'
    && EN_E08_HOLLOW_SENTRY_DATA.childAssets.length === 0
    && EN_E08_HOLLOW_SENTRY_DATA.bakedEffects.length === 0,
  'Hollow Sentry empty-suit identity, topology, or effect firewall drifted',
);
check(
  EN_E08_HOLLOW_SENTRY_GATE.scope.includes('complete 80-frame Hollow Sentry common Animated Armor')
    && EN_E08_HOLLOW_SENTRY_GATE.animationContract.includes('four weighty iron steps')
    && EN_E08_HOLLOW_SENTRY_GATE.animationContract.includes('connected full-body iron clamp')
    && EN_E08_HOLLOW_SENTRY_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E08_HOLLOW_SENTRY_GATE.nextGate.includes('implementation 914aa700b82469dbb22ca1600f1bc7ad6dbecff7')
    && EN_E08_HOLLOW_SENTRY_GATE.nextGate.includes('bounded approval-record publication')
    && EN_E08_HOLLOW_SENTRY_GATE.nextGate.includes('separate designer lets do next'),
  'full-suite, motion, or stop-gate contract drifted',
);
check(
  EN_E08_HOLLOW_SENTRY_GATE.exclusions.includes('public Animated Armor registration')
    && EN_E08_HOLLOW_SENTRY_GATE.exclusions.includes('schema changes')
    && EN_E08_HOLLOW_SENTRY_GATE.exclusions.includes('deterministic child/state exports')
    && EN_E08_HOLLOW_SENTRY_GATE.exclusions.includes('runtime attachment offsets')
    && EN_E08_HOLLOW_SENTRY_GATE.exclusions.includes('handheld weapon or shield')
    && EN_E08_HOLLOW_SENTRY_GATE.exclusions.includes('Living Weapon')
    && EN_E08_HOLLOW_SENTRY_GATE.exclusions.includes('accepted drift'),
  'EN-E08 scope exclusions drifted',
);
check(
  Object.isFrozen(EN_E08_ACTOR_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E08_ANIMATED_ARMOR_CONTRACT_CARD)
    && Object.isFrozen(EN_E08_HOLLOW_SENTRY_CONTRACT)
    && Object.isFrozen(EN_E08_HOLLOW_SENTRY_DATA)
    && Object.isFrozen(EN_E08_HOLLOW_SENTRY_GATE),
  'architecture decision, gate, data, and contracts must be deeply immutable',
);
check(
  EN_E08_HOLLOW_SENTRY_REGISTRY.families.length === 1
    && EN_E08_HOLLOW_SENTRY_REGISTRY.publicFamilies.length === 0
    && EN_E08_HOLLOW_SENTRY_FAMILY.variants.length === 1,
  'candidate registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'animated-armor'),
  'candidate must preserve public 80/259 and keep Animated Armor private',
);
check(engine.EN_E08_HOLLOW_SENTRY_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('animated-armor'), 'public expansion registry must not mention Animated Armor');
check(!manifestSource.includes('animated-armor'), 'asset manifest must not mention Animated Armor');

const captures = new Map();
const candidateRecords = [];
const fallenKnightRecords = [];
const revenantRecords = [];
const gloamWalkerRecords = [];
const palettes = [
  ['plate', new Set(EN_E08_HOLLOW_SENTRY_DATA.hollowSentry.plate)],
  ['rust', new Set(EN_E08_HOLLOW_SENTRY_DATA.hollowSentry.rust)],
  ['binding', new Set(EN_E08_HOLLOW_SENTRY_DATA.hollowSentry.binding)],
  ['haunt', new Set(EN_E08_HOLLOW_SENTRY_DATA.hollowSentry.haunt)],
  ['cavity', new Set(EN_E08_HOLLOW_SENTRY_DATA.hollowSentry.cavity)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let splitSabatons = 0;
let broadPlateFrames = 0;
let colored = 0;
let flashes = 0;
let visorViews = 0;
let topologyFrames = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let fallenKnightDifferences = 0;
let fallenKnightAlphaDifferences = 0;
let revenantDifferences = 0;
let revenantAlphaDifferences = 0;
let gloamWalkerDifferences = 0;
let gloamWalkerAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const frameKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E08_HOLLOW_SENTRY_REGISTRY, candidateSpec, direction, animation.id, frame);
    const fallenKnight = captureEnemyExpansionFrame(EN_E01_PUBLIC_REGISTRY, fallenKnightSpec, direction, animation.id, frame);
    const revenant = captureEnemyExpansionFrame(EN_E05_REVENANT_REGISTRY, revenantSpec, direction, animation.id, frame);
    const gloamWalker = captureEnemyExpansionFrame(EN_E07_GLOAM_WALKER_REGISTRY, gloamWalkerSpec, direction, animation.id, frame);
    captures.set(frameKey, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    fallenKnightRecords.push(frameRecord(fallenKnight, fallenKnightSpec, direction, animation.id, frame));
    revenantRecords.push(frameRecord(revenant, revenantSpec, direction, animation.id, frame));
    gloamWalkerRecords.push(frameRecord(gloamWalker, gloamWalkerSpec, direction, animation.id, frame));

    check(candidate.outOfBoundsWrites.length === 0, frameKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), frameKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++;
    else check(false, frameKey + ' must remain one connected baked actor');
    const isBounded = candidate.bounds
      && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1
      && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++;
    else check(false, frameKey + ' lost the one-cell margin');
    if (candidate.bounds?.maxY === 22) grounded++;
    else check(false, frameKey + ' lost grounded sabaton contact');
    check(candidate.opaquePixels >= 210 && candidate.opaquePixels <= 315, frameKey + ' density is implausible for the broad common empty suit');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (rowRuns(candidate.pixels, 22) >= 2) splitSabatons++;
    else check(false, frameKey + ' lost the two separated grounded sabatons');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    if (width >= 12 && height >= 19) broadPlateFrames++;
    else check(false, frameKey + ' lost the broad tall empty-suit span');

    if (candidate.digest !== fallenKnight.digest) fallenKnightDifferences++;
    if (candidate.alphaDigest !== fallenKnight.alphaDigest) fallenKnightAlphaDifferences++;
    if (candidate.digest !== revenant.digest) revenantDifferences++;
    if (candidate.alphaDigest !== revenant.alphaDigest) revenantAlphaDifferences++;
    if (candidate.digest !== gloamWalker.digest) gloamWalkerDifferences++;
    if (candidate.alphaDigest !== gloamWalker.alphaDigest) gloamWalkerAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), frameKey + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, frameKey + ' lost ' + name + ' palette identity');
      const eyes = countColors(candidate.pixels, new Set([EN_E08_HOLLOW_SENTRY_DATA.hollowSentry.eye]));
      if (direction === 'up') {
        check(eyes === 0, frameKey + ' rear view must not expose visor eyes');
      } else if (direction === 'down') {
        check(eyes === 2, frameKey + ' front view must preserve two readable visor eyes');
        visorViews++;
      } else {
        check(eyes === 1, frameKey + ' side view must preserve one readable profile visor eye');
        visorViews++;
      }
      colored++;
    }

    if (
      candidate.renderResult.hollowSentryGate === EN_E08_HOLLOW_SENTRY_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_BLACKWAKE_DREADMARE_GATE.id
        && candidate.renderResult.actorTopology === 'baked-single-actor'
        && candidate.renderResult.childAssetCount === 0
    ) topologyFrames++;
    else check(false, frameKey + ' baked topology metadata drifted');

    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E08_HOLLOW_SENTRY_DATA);
    completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
    formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
  }
  const uniqueMotion = new Set(animationDigests).size;
  if (animation.id === 'idle' || animation.id === 'hurt' || animation.id === 'death') {
    check(uniqueMotion === 2, direction + ' ' + animation.id + ' must preserve both authored alias phases');
  } else {
    check(uniqueMotion >= 3, direction + ' ' + animation.id + ' must preserve at least three distinct motion phases');
  }
}

for (const direction of directions) for (let frame = 0; frame < 4; frame++) {
  const attack = captures.get(direction + '/attack/' + frame);
  const cast = captures.get(direction + '/cast/' + frame);
  check(cast.digest === attack.digest, direction + ' Cast C' + (frame + 1) + ' must alias Attack exactly');
  const death = captures.get(direction + '/death/' + frame);
  const hurt = captures.get(direction + '/hurt/' + EN_E08_HOLLOW_SENTRY_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const candidateDigest = hashJson(candidateRecords);
const fallenKnightDigest = hashJson(fallenKnightRecords);
const revenantDigest = hashJson(revenantRecords);
const gloamWalkerDigest = hashJson(gloamWalkerRecords);
if (EN_E08_HOLLOW_SENTRY_GATE.candidateFrameDigest) check(candidateDigest === EN_E08_HOLLOW_SENTRY_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E08_HOLLOW_SENTRY_GATE.fallenKnightComparisonDigest) check(fallenKnightDigest === EN_E08_HOLLOW_SENTRY_GATE.fallenKnightComparisonDigest, 'Fallen Knight comparison digest drifted');
if (EN_E08_HOLLOW_SENTRY_GATE.revenantComparisonDigest) check(revenantDigest === EN_E08_HOLLOW_SENTRY_GATE.revenantComparisonDigest, 'Revenant comparison digest drifted');
if (EN_E08_HOLLOW_SENTRY_GATE.gloamWalkerComparisonDigest) check(gloamWalkerDigest === EN_E08_HOLLOW_SENTRY_GATE.gloamWalkerComparisonDigest, 'Gloam Walker comparison digest drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Hollow Sentry frames must be connected, bounded, and grounded');
check(splitSabatons === 80 && broadPlateFrames === 80, 'all 80 frames must preserve split sabatons and the broad tall empty-suit span');
check(colored === 72 && flashes === 8 && visorViews === 54 && topologyFrames === 80, 'colored, flash, visor-view, or baked-topology totals drifted');
check(fallenKnightDifferences === 80 && fallenKnightAlphaDifferences === 80, 'Hollow Sentry must differ from Fallen Knight in all 80 pixel and alpha frames');
check(revenantDifferences === 80 && revenantAlphaDifferences === 80, 'Hollow Sentry must differ from Revenant in all 80 pixel and alpha frames');
check(gloamWalkerDifferences === 80 && gloamWalkerAlphaDifferences === 80, 'Hollow Sentry must differ from Gloam Walker in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E08_HOLLOW_SENTRY_GATE.artifactSha256) check(await fileHash(EN_E08_HOLLOW_SENTRY_GATE.artifact) === EN_E08_HOLLOW_SENTRY_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E08_HOLLOW_SENTRY_GATE.assembledArtifactSha256) check(await fileHash(EN_E08_HOLLOW_SENTRY_GATE.assembledArtifact) === EN_E08_HOLLOW_SENTRY_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E08_HOLLOW_SENTRY_GATE.comparisonArtifactSha256) check(await fileHash(EN_E08_HOLLOW_SENTRY_GATE.comparisonArtifact) === EN_E08_HOLLOW_SENTRY_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E08_HOLLOW_SENTRY_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E08_HOLLOW_SENTRY_GATE.reviewAnimations.raw.artifact) === EN_E08_HOLLOW_SENTRY_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E08_HOLLOW_SENTRY_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E08_HOLLOW_SENTRY_GATE.reviewAnimations.completeBForm.artifact) === EN_E08_HOLLOW_SENTRY_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E08_HOLLOW_SENTRY_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E08_HOLLOW_SENTRY_REGISTRY, { ...candidateSpec, family: 'revenant' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E08_HOLLOW_SENTRY_REGISTRY, { ...candidateSpec, variant: 'floating-helm' }, 'down', 'idle', 0), 'wrong variant');

check(EN_E05_REVENANT_GATE.candidateFrameDigest === revenantDigest, 'approved Revenant comparison source drifted');
check(EN_E07_GLOAM_WALKER_GATE.candidateFrameDigest === gloamWalkerDigest, 'approved Gloam Walker comparison source drifted');

if (errors.length) {
  console.error('EN-E08 Animated Armor Hollow Sentry focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E08 Animated Armor Hollow Sentry focused gate passed.');
  console.log('- Actor topology: 80/80 baked single-actor frames; 0 child assets; no schema, exporter, validator, or frame-contract change');
  console.log('- Fallen Knight distinction: ' + fallenKnightDifferences + '/80 pixel frames and ' + fallenKnightAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Revenant distinction: ' + revenantDifferences + '/80 pixel frames and ' + revenantAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Gloam Walker distinction: ' + gloamWalkerDifferences + '/80 pixel frames and ' + gloamWalkerAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + splitSabatons + '/80 split sabaton rows; ' + broadPlateFrames + '/80 broad tall plate spans; ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + visorViews + '/54 readable visor views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: Blackwake predecessor, Fallen Knight, Revenant, and Gloam Walker exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Fallen Knight Shieldbearer frame digest: ' + fallenKnightDigest);
  console.log('- Grave Oathkeeper Revenant frame digest: ' + revenantDigest);
  console.log('- Gloam Walker frame digest: ' + gloamWalkerDigest);
}
