import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E01_PUBLIC_REGISTRY } from '../engine/enemy-expansion-en-e01.js';
import {
  EN_E08_HOLLOW_SENTRY_GATE,
  EN_E08_HOLLOW_SENTRY_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-hollow-sentry.js';
import {
  EN_E08_RUNEFORGE_CUSTODIAN_GATE,
  EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-runeforge-custodian.js';
import {
  EN_E08_ACTOR_TOPOLOGY_DECISION,
  EN_E08_ANIMATED_ARMOR_CONTRACT_CARD,
  EN_E08_CROWNVAULT_CASTELLAN_CONTRACT,
  EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD,
  EN_E08_CROWNVAULT_CASTELLAN_DATA,
  EN_E08_CROWNVAULT_CASTELLAN_DEATH_SOURCE_FRAMES,
  EN_E08_CROWNVAULT_CASTELLAN_FAMILY,
  EN_E08_CROWNVAULT_CASTELLAN_GATE,
  EN_E08_CROWNVAULT_CASTELLAN_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-crownvault-castellan.js';
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
const candidateSpec = { kind: 'enemy', family: 'animated-armor', variant: 'crownvault-castellan' };
const fallenKnightSpec = { kind: 'enemy', family: 'fallen-knight', variant: 'shieldbearer' };
const runeforgeCustodianSpec = { kind: 'enemy', family: 'animated-armor', variant: 'runeforge-custodian' };
const hollowSentrySpec = { kind: 'enemy', family: 'animated-armor', variant: 'hollow-sentry' };

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
  EN_E08_CROWNVAULT_CASTELLAN_GATE.status === 'approved'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.baseCheckpoint === '700f2cedb1d3104369931a97bfec31a3b49fff93'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.authorizedOn === '2026-08-11'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.authorizationEvidence.includes('designer replied: lets do nextr')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.authorizationEvidence.includes('one private elite Animated Armor Crownvault Castellan')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.architectureDecision === EN_E08_ACTOR_TOPOLOGY_DECISION.id
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.approvedOn === '2026-08-11'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.approvalEvidence.includes('designer replied: approved')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.approvalEvidence.includes('process 32136')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.approvedImplementation === '46d09a4e16a11f9c622cb698ff30055bb9bcb877'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.publicationAuthorizedOn === '2026-08-11'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.publishedImplementation === '46d09a4e16a11f9c622cb698ff30055bb9bcb877'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.publishedApprovalRecord === '9c21f92aed06a66092279e8d53db6cb9a289cbd9'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.initialPublishedHandoff === null
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.publicationState === 'published-awaiting-handoff-reconciliation'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.publicationAuthorizationEvidence.includes('pull request'),
  'Crownvault Castellan approval or initial publication gate drifted',
);
check(
  EN_E08_CROWNVAULT_CASTELLAN_GATE.precedingApproval.gateId === EN_E08_RUNEFORGE_CUSTODIAN_GATE.id
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.precedingApproval.candidateFrameDigest === EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.precedingApproval.publishedImplementation === EN_E08_RUNEFORGE_CUSTODIAN_GATE.publishedImplementation
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.precedingApproval.publishedApprovalRecord === EN_E08_RUNEFORGE_CUSTODIAN_GATE.publishedApprovalRecord
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.precedingApproval.initialPublishedHandoff === EN_E08_RUNEFORGE_CUSTODIAN_GATE.initialPublishedHandoff
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.precedingApproval.currentReconciliation === '700f2cedb1d3104369931a97bfec31a3b49fff93'
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.precedingApproval.reconciliationPublication === 'published',
  'approved Runeforge Custodian predecessor drifted',
);
check(
  EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.collisionRuling.includes('Haunted Armor and Animated Armor are one animated-armor family')
    && JSON.stringify(EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.activeVariant.id === 'hollow-sentry'
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.precedingVariant.id === 'runeforge-custodian'
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.activeVariant.id === 'crownvault-castellan'
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.activeVariant.identity === 'royal-fortress-vault'
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.deferredRoles.length === 0
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.actorTopology === 'baked-single-actor',
  'Animated Armor collision ruling, role order, or topology boundary drifted',
);
check(
  EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.state === 'implemented-complete-motion-approved'
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.topology === 'baked-single-actor'
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.silhouette.includes('centered T-shaped vault seal')
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.silhouette.includes('connected bastion gauntlets')
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.silhouette.includes('boss-scale colossus')
    && EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.visualIdentity.includes('No paired ghost eyes')
    && EN_E08_CROWNVAULT_CASTELLAN_DATA.actorTopology === 'baked-single-actor'
    && EN_E08_CROWNVAULT_CASTELLAN_DATA.childAssets.length === 0
    && EN_E08_CROWNVAULT_CASTELLAN_DATA.bakedEffects.length === 0,
  'Crownvault Castellan fortress identity, topology, or effect firewall drifted',
);
check(
  EN_E08_CROWNVAULT_CASTELLAN_GATE.scope.includes('complete 80-frame Crownvault Castellan elite Animated Armor')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.animationContract.includes('four monumental plinth-stamp phases')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.animationContract.includes('body-owned fortress press')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.nextGate.includes('implementation 46d09a4e16a11f9c622cb698ff30055bb9bcb877')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.nextGate.includes('approval record 9c21f92aed06a66092279e8d53db6cb9a289cbd9')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.nextGate.includes('initial published handoff and final reconciliation remain open')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.nextGate.includes('another art gate requires a separate designer lets do next'),
  'full-suite, motion, or stop-gate contract drifted',
);
check(
  EN_E08_CROWNVAULT_CASTELLAN_GATE.exclusions.includes('public Animated Armor registration')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.exclusions.includes('schema changes')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.exclusions.includes('deterministic child/state exports')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.exclusions.includes('runtime attachment offsets')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.exclusions.includes('handheld weapon or shield')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.exclusions.includes('Living Weapon')
    && EN_E08_CROWNVAULT_CASTELLAN_GATE.exclusions.includes('accepted drift'),
  'EN-E08 scope exclusions drifted',
);
check(
  Object.isFrozen(EN_E08_ACTOR_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E08_ANIMATED_ARMOR_CONTRACT_CARD)
    && Object.isFrozen(EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD)
    && Object.isFrozen(EN_E08_CROWNVAULT_CASTELLAN_CONTRACT)
    && Object.isFrozen(EN_E08_CROWNVAULT_CASTELLAN_DATA)
    && Object.isFrozen(EN_E08_CROWNVAULT_CASTELLAN_GATE),
  'architecture decision, gate, data, and contracts must be deeply immutable',
);
check(
  EN_E08_CROWNVAULT_CASTELLAN_REGISTRY.families.length === 1
    && EN_E08_CROWNVAULT_CASTELLAN_REGISTRY.publicFamilies.length === 0
    && EN_E08_CROWNVAULT_CASTELLAN_FAMILY.variants.length === 1,
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
check(engine.EN_E08_CROWNVAULT_CASTELLAN_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('animated-armor'), 'public expansion registry must not mention Animated Armor');
check(!manifestSource.includes('animated-armor'), 'asset manifest must not mention Animated Armor');

const captures = new Map();
const candidateRecords = [];
const fallenKnightRecords = [];
const runeforgeCustodianRecords = [];
const hollowSentryRecords = [];
const palettes = [
  ['plate', new Set(EN_E08_CROWNVAULT_CASTELLAN_DATA.crownvaultCastellan.plate)],
  ['gold', new Set(EN_E08_CROWNVAULT_CASTELLAN_DATA.crownvaultCastellan.gold)],
  ['vault', new Set(EN_E08_CROWNVAULT_CASTELLAN_DATA.crownvaultCastellan.vault)],
  ['joint', new Set(EN_E08_CROWNVAULT_CASTELLAN_DATA.crownvaultCastellan.joint)],
  ['cavity', new Set(EN_E08_CROWNVAULT_CASTELLAN_DATA.crownvaultCastellan.cavity)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let splitPlinthSabatons = 0;
let fortressSpanFrames = 0;
let colored = 0;
let flashes = 0;
let vaultSealViews = 0;
let topologyFrames = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let fallenKnightDifferences = 0;
let fallenKnightAlphaDifferences = 0;
let runeforgeCustodianDifferences = 0;
let runeforgeCustodianAlphaDifferences = 0;
let hollowSentryDifferences = 0;
let hollowSentryAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const frameKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E08_CROWNVAULT_CASTELLAN_REGISTRY, candidateSpec, direction, animation.id, frame);
    const fallenKnight = captureEnemyExpansionFrame(EN_E01_PUBLIC_REGISTRY, fallenKnightSpec, direction, animation.id, frame);
    const runeforgeCustodian = captureEnemyExpansionFrame(EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY, runeforgeCustodianSpec, direction, animation.id, frame);
    const hollowSentry = captureEnemyExpansionFrame(EN_E08_HOLLOW_SENTRY_REGISTRY, hollowSentrySpec, direction, animation.id, frame);
    captures.set(frameKey, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    fallenKnightRecords.push(frameRecord(fallenKnight, fallenKnightSpec, direction, animation.id, frame));
    runeforgeCustodianRecords.push(frameRecord(runeforgeCustodian, runeforgeCustodianSpec, direction, animation.id, frame));
    hollowSentryRecords.push(frameRecord(hollowSentry, hollowSentrySpec, direction, animation.id, frame));

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
    check(candidate.opaquePixels >= 250 && candidate.opaquePixels <= 390, frameKey + ' density is implausible for the monumental fortress elite');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (rowRuns(candidate.pixels, 22) >= 2) splitPlinthSabatons++;
    else check(false, frameKey + ' lost the two separated grounded plinth sabatons');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    if (width >= 16 && height >= 20) fortressSpanFrames++;
    else check(false, frameKey + ' lost the broad tall fortress span');

    if (candidate.digest !== fallenKnight.digest) fallenKnightDifferences++;
    if (candidate.alphaDigest !== fallenKnight.alphaDigest) fallenKnightAlphaDifferences++;
    if (candidate.digest !== runeforgeCustodian.digest) runeforgeCustodianDifferences++;
    if (candidate.alphaDigest !== runeforgeCustodian.alphaDigest) runeforgeCustodianAlphaDifferences++;
    if (candidate.digest !== hollowSentry.digest) hollowSentryDifferences++;
    if (candidate.alphaDigest !== hollowSentry.alphaDigest) hollowSentryAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), frameKey + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, frameKey + ' lost ' + name + ' palette identity');
      const seal = countColors(candidate.pixels, new Set([EN_E08_CROWNVAULT_CASTELLAN_DATA.crownvaultCastellan.seal]));
      if (direction === 'up') {
        check(seal === 0, frameKey + ' rear view must not expose the face vault seal');
      } else if (direction === 'down') {
        check(seal === 8, frameKey + ' front view must preserve one readable eight-pixel T-shaped vault seal');
        vaultSealViews++;
      } else {
        check(seal === 5, frameKey + ' side view must preserve one readable five-pixel profile T-seal');
        vaultSealViews++;
      }
      colored++;
    }

    if (
      candidate.renderResult.crownvaultCastellanGate === EN_E08_CROWNVAULT_CASTELLAN_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E08_RUNEFORGE_CUSTODIAN_GATE.id
        && candidate.renderResult.actorTopology === 'baked-single-actor'
        && candidate.renderResult.childAssetCount === 0
    ) topologyFrames++;
    else check(false, frameKey + ' baked topology metadata drifted');

    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E08_CROWNVAULT_CASTELLAN_DATA);
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
  const hurt = captures.get(direction + '/hurt/' + EN_E08_CROWNVAULT_CASTELLAN_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const candidateDigest = hashJson(candidateRecords);
const fallenKnightDigest = hashJson(fallenKnightRecords);
const runeforgeCustodianDigest = hashJson(runeforgeCustodianRecords);
const hollowSentryDigest = hashJson(hollowSentryRecords);
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest) check(candidateDigest === EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.fallenKnightComparisonDigest) check(fallenKnightDigest === EN_E08_CROWNVAULT_CASTELLAN_GATE.fallenKnightComparisonDigest, 'Fallen Knight comparison digest drifted');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.runeforgeCustodianComparisonDigest) check(runeforgeCustodianDigest === EN_E08_CROWNVAULT_CASTELLAN_GATE.runeforgeCustodianComparisonDigest, 'Runeforge Custodian comparison digest drifted');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.hollowSentryComparisonDigest) check(hollowSentryDigest === EN_E08_CROWNVAULT_CASTELLAN_GATE.hollowSentryComparisonDigest, 'Hollow Sentry comparison digest drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Crownvault Castellan frames must be connected, bounded, and grounded');
check(splitPlinthSabatons === 80 && fortressSpanFrames === 80, 'all 80 frames must preserve split plinth sabatons and the broad tall fortress span');
check(colored === 72 && flashes === 8 && vaultSealViews === 54 && topologyFrames === 80, 'colored, flash, vault-seal-view, or baked-topology totals drifted');
check(fallenKnightDifferences === 80 && fallenKnightAlphaDifferences === 80, 'Crownvault Castellan must differ from Fallen Knight in all 80 pixel and alpha frames');
check(runeforgeCustodianDifferences === 80 && runeforgeCustodianAlphaDifferences === 80, 'Crownvault Castellan must differ from Runeforge Custodian in all 80 pixel and alpha frames');
check(hollowSentryDifferences === 80 && hollowSentryAlphaDifferences === 80, 'Crownvault Castellan must differ from Hollow Sentry in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E08_CROWNVAULT_CASTELLAN_GATE.artifactSha256) check(await fileHash(EN_E08_CROWNVAULT_CASTELLAN_GATE.artifact) === EN_E08_CROWNVAULT_CASTELLAN_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.assembledArtifactSha256) check(await fileHash(EN_E08_CROWNVAULT_CASTELLAN_GATE.assembledArtifact) === EN_E08_CROWNVAULT_CASTELLAN_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.comparisonArtifactSha256) check(await fileHash(EN_E08_CROWNVAULT_CASTELLAN_GATE.comparisonArtifact) === EN_E08_CROWNVAULT_CASTELLAN_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E08_CROWNVAULT_CASTELLAN_GATE.reviewAnimations.raw.artifact) === EN_E08_CROWNVAULT_CASTELLAN_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E08_CROWNVAULT_CASTELLAN_GATE.reviewAnimations.completeBForm.artifact) === EN_E08_CROWNVAULT_CASTELLAN_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E08_CROWNVAULT_CASTELLAN_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E08_CROWNVAULT_CASTELLAN_REGISTRY, { ...candidateSpec, family: 'revenant' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E08_CROWNVAULT_CASTELLAN_REGISTRY, { ...candidateSpec, variant: 'floating-helm' }, 'down', 'idle', 0), 'wrong variant');

check(EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest === runeforgeCustodianDigest, 'approved Runeforge Custodian comparison source drifted');
check(EN_E08_HOLLOW_SENTRY_GATE.candidateFrameDigest === hollowSentryDigest, 'approved Hollow Sentry comparison source drifted');

if (errors.length) {
  console.error('EN-E08 Animated Armor Crownvault Castellan focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E08 Animated Armor Crownvault Castellan focused gate passed.');
  console.log('- Actor topology: 80/80 baked single-actor frames; 0 child assets; no schema, exporter, validator, or frame-contract change');
  console.log('- Fallen Knight distinction: ' + fallenKnightDifferences + '/80 pixel frames and ' + fallenKnightAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Runeforge Custodian distinction: ' + runeforgeCustodianDifferences + '/80 pixel frames and ' + runeforgeCustodianAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Hollow Sentry distinction: ' + hollowSentryDifferences + '/80 pixel frames and ' + hollowSentryAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + splitPlinthSabatons + '/80 split plinth rows; ' + fortressSpanFrames + '/80 broad tall fortress spans; ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + vaultSealViews + '/54 readable T-seal views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: Runeforge Custodian predecessor, Hollow Sentry, and Fallen Knight exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Fallen Knight Shieldbearer frame digest: ' + fallenKnightDigest);
  console.log('- Runeforge Custodian frame digest: ' + runeforgeCustodianDigest);
  console.log('- Hollow Sentry frame digest: ' + hollowSentryDigest);
}
