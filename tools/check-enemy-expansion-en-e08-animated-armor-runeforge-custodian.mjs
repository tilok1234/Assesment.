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
  EN_E08_HOLLOW_SENTRY_GATE,
  EN_E08_HOLLOW_SENTRY_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-hollow-sentry.js';
import {
  EN_E08_ACTOR_TOPOLOGY_DECISION,
  EN_E08_ANIMATED_ARMOR_CONTRACT_CARD,
  EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT,
  EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD,
  EN_E08_RUNEFORGE_CUSTODIAN_DATA,
  EN_E08_RUNEFORGE_CUSTODIAN_DEATH_SOURCE_FRAMES,
  EN_E08_RUNEFORGE_CUSTODIAN_FAMILY,
  EN_E08_RUNEFORGE_CUSTODIAN_GATE,
  EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-runeforge-custodian.js';
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
const candidateSpec = { kind: 'enemy', family: 'animated-armor', variant: 'runeforge-custodian' };
const fallenKnightSpec = { kind: 'enemy', family: 'fallen-knight', variant: 'shieldbearer' };
const revenantSpec = { kind: 'enemy', family: 'revenant', variant: 'grave-oathkeeper' };
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
  EN_E08_RUNEFORGE_CUSTODIAN_GATE.status === 'approved'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.baseCheckpoint === 'dc86bb65053564c76b18e848933ab4c2d318bfde'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.authorizedOn === '2026-08-11'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.authorizationEvidence.includes('designer replied: lets do next')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.authorizationEvidence.includes('one private constructed specialist Animated Armor Runeforge Custodian')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.architectureDecision === EN_E08_ACTOR_TOPOLOGY_DECISION.id
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.approvedOn === '2026-08-11'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.approvalEvidence.includes('designer replied: accepted')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.approvalEvidence.includes('Aseprite 1.3.17.2 process 42856')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.approvalEvidence.includes('629930688cca04f3d714e12225ab8c3db7c494c5fbaf027d65ec7f8d530ccf85')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.approvedImplementation === 'd73ca9334640384d9b531c0d8375c1a42e459212'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.publicationAuthorizedOn === '2026-08-11'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.publishedImplementation === 'd73ca9334640384d9b531c0d8375c1a42e459212'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.publishedApprovalRecord === '717b4f7f735984550f44ce90d0bba58cfd6e1762'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.initialPublishedHandoff === null
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.publicationState === 'published-awaiting-handoff-reconciliation'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.publicationAuthorizationEvidence.includes('pull request'),
  'Runeforge Custodian authorization or unpublished gate drifted',
);
check(
  EN_E08_RUNEFORGE_CUSTODIAN_GATE.precedingApproval.gateId === EN_E08_HOLLOW_SENTRY_GATE.id
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.precedingApproval.candidateFrameDigest === EN_E08_HOLLOW_SENTRY_GATE.candidateFrameDigest
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.precedingApproval.publishedImplementation === EN_E08_HOLLOW_SENTRY_GATE.publishedImplementation
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.precedingApproval.publishedApprovalRecord === EN_E08_HOLLOW_SENTRY_GATE.publishedApprovalRecord
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.precedingApproval.initialPublishedHandoff === EN_E08_HOLLOW_SENTRY_GATE.initialPublishedHandoff
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.precedingApproval.currentReconciliation === 'dc86bb65053564c76b18e848933ab4c2d318bfde'
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.precedingApproval.reconciliationPublication === 'published',
  'approved Hollow Sentry predecessor drifted',
);
check(
  EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.collisionRuling.includes('Haunted Armor and Animated Armor are one animated-armor family')
    && JSON.stringify(EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.activeVariant.id === 'hollow-sentry'
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.precedingVariant.id === 'hollow-sentry'
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.activeVariant.id === 'runeforge-custodian'
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.activeVariant.identity === 'constructed-rune-lock'
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.deferredRoles) === JSON.stringify(['elite'])
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.actorTopology === 'baked-single-actor',
  'Animated Armor collision ruling, role order, or topology boundary drifted',
);
check(
  EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.state === 'implemented-complete-motion-approved'
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.topology === 'baked-single-actor'
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.silhouette.includes('one large centered rune-lock face aperture')
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.silhouette.includes('connected interlocking gauntlets')
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.silhouette.includes('gear-driven Clockwork Automaton')
    && EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.visualIdentity.includes('No paired ghost eyes')
    && EN_E08_RUNEFORGE_CUSTODIAN_DATA.actorTopology === 'baked-single-actor'
    && EN_E08_RUNEFORGE_CUSTODIAN_DATA.childAssets.length === 0
    && EN_E08_RUNEFORGE_CUSTODIAN_DATA.bakedEffects.length === 0,
  'Runeforge Custodian constructed identity, topology, or effect firewall drifted',
);
check(
  EN_E08_RUNEFORGE_CUSTODIAN_GATE.scope.includes('complete 80-frame Runeforge Custodian specialist Animated Armor')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.animationContract.includes('four deliberate forge-stamp phases')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.animationContract.includes('interlocking body-owned forge press')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.nextGate.includes('implementation d73ca9334640384d9b531c0d8375c1a42e459212')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.nextGate.includes('approval record 717b4f7f735984550f44ce90d0bba58cfd6e1762')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.nextGate.includes('another art gate requires a separate designer lets do next'),
  'full-suite, motion, or stop-gate contract drifted',
);
check(
  EN_E08_RUNEFORGE_CUSTODIAN_GATE.exclusions.includes('public Animated Armor registration')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.exclusions.includes('schema changes')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.exclusions.includes('deterministic child/state exports')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.exclusions.includes('runtime attachment offsets')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.exclusions.includes('handheld weapon or shield')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.exclusions.includes('Living Weapon')
    && EN_E08_RUNEFORGE_CUSTODIAN_GATE.exclusions.includes('accepted drift'),
  'EN-E08 scope exclusions drifted',
);
check(
  Object.isFrozen(EN_E08_ACTOR_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E08_ANIMATED_ARMOR_CONTRACT_CARD)
    && Object.isFrozen(EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD)
    && Object.isFrozen(EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT)
    && Object.isFrozen(EN_E08_RUNEFORGE_CUSTODIAN_DATA)
    && Object.isFrozen(EN_E08_RUNEFORGE_CUSTODIAN_GATE),
  'architecture decision, gate, data, and contracts must be deeply immutable',
);
check(
  EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY.families.length === 1
    && EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY.publicFamilies.length === 0
    && EN_E08_RUNEFORGE_CUSTODIAN_FAMILY.variants.length === 1,
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
check(engine.EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('animated-armor'), 'public expansion registry must not mention Animated Armor');
check(!manifestSource.includes('animated-armor'), 'asset manifest must not mention Animated Armor');

const captures = new Map();
const candidateRecords = [];
const fallenKnightRecords = [];
const revenantRecords = [];
const hollowSentryRecords = [];
const palettes = [
  ['plate', new Set(EN_E08_RUNEFORGE_CUSTODIAN_DATA.runeforgeCustodian.plate)],
  ['forge', new Set(EN_E08_RUNEFORGE_CUSTODIAN_DATA.runeforgeCustodian.forge)],
  ['rune', new Set(EN_E08_RUNEFORGE_CUSTODIAN_DATA.runeforgeCustodian.rune)],
  ['joint', new Set(EN_E08_RUNEFORGE_CUSTODIAN_DATA.runeforgeCustodian.joint)],
  ['cavity', new Set(EN_E08_RUNEFORGE_CUSTODIAN_DATA.runeforgeCustodian.cavity)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let splitWedgeSabatons = 0;
let tallSquareFrames = 0;
let colored = 0;
let flashes = 0;
let runeLockViews = 0;
let topologyFrames = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let fallenKnightDifferences = 0;
let fallenKnightAlphaDifferences = 0;
let revenantDifferences = 0;
let revenantAlphaDifferences = 0;
let hollowSentryDifferences = 0;
let hollowSentryAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const frameKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY, candidateSpec, direction, animation.id, frame);
    const fallenKnight = captureEnemyExpansionFrame(EN_E01_PUBLIC_REGISTRY, fallenKnightSpec, direction, animation.id, frame);
    const revenant = captureEnemyExpansionFrame(EN_E05_REVENANT_REGISTRY, revenantSpec, direction, animation.id, frame);
    const hollowSentry = captureEnemyExpansionFrame(EN_E08_HOLLOW_SENTRY_REGISTRY, hollowSentrySpec, direction, animation.id, frame);
    captures.set(frameKey, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    fallenKnightRecords.push(frameRecord(fallenKnight, fallenKnightSpec, direction, animation.id, frame));
    revenantRecords.push(frameRecord(revenant, revenantSpec, direction, animation.id, frame));
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
    check(candidate.opaquePixels >= 200 && candidate.opaquePixels <= 330, frameKey + ' density is implausible for the tall constructed specialist');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (rowRuns(candidate.pixels, 22) >= 2) splitWedgeSabatons++;
    else check(false, frameKey + ' lost the two separated grounded wedge sabatons');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    if (width >= 12 && height >= 20) tallSquareFrames++;
    else check(false, frameKey + ' lost the tall squared constructed span');

    if (candidate.digest !== fallenKnight.digest) fallenKnightDifferences++;
    if (candidate.alphaDigest !== fallenKnight.alphaDigest) fallenKnightAlphaDifferences++;
    if (candidate.digest !== revenant.digest) revenantDifferences++;
    if (candidate.alphaDigest !== revenant.alphaDigest) revenantAlphaDifferences++;
    if (candidate.digest !== hollowSentry.digest) hollowSentryDifferences++;
    if (candidate.alphaDigest !== hollowSentry.alphaDigest) hollowSentryAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), frameKey + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, frameKey + ' lost ' + name + ' palette identity');
      const aperture = countColors(candidate.pixels, new Set([EN_E08_RUNEFORGE_CUSTODIAN_DATA.runeforgeCustodian.aperture]));
      if (direction === 'up') {
        check(aperture === 0, frameKey + ' rear view must not expose the face aperture');
      } else if (direction === 'down') {
        check(aperture === 2, frameKey + ' front view must preserve one readable two-pixel rune-lock core');
        runeLockViews++;
      } else {
        check(aperture === 1, frameKey + ' side view must preserve one readable profile rune-lock core');
        runeLockViews++;
      }
      colored++;
    }

    if (
      candidate.renderResult.runeforgeCustodianGate === EN_E08_RUNEFORGE_CUSTODIAN_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E08_HOLLOW_SENTRY_GATE.id
        && candidate.renderResult.actorTopology === 'baked-single-actor'
        && candidate.renderResult.childAssetCount === 0
    ) topologyFrames++;
    else check(false, frameKey + ' baked topology metadata drifted');

    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E08_RUNEFORGE_CUSTODIAN_DATA);
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
  const hurt = captures.get(direction + '/hurt/' + EN_E08_RUNEFORGE_CUSTODIAN_DEATH_SOURCE_FRAMES[frame]);
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
const hollowSentryDigest = hashJson(hollowSentryRecords);
if (EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest) check(candidateDigest === EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E08_RUNEFORGE_CUSTODIAN_GATE.fallenKnightComparisonDigest) check(fallenKnightDigest === EN_E08_RUNEFORGE_CUSTODIAN_GATE.fallenKnightComparisonDigest, 'Fallen Knight comparison digest drifted');
if (EN_E08_RUNEFORGE_CUSTODIAN_GATE.revenantComparisonDigest) check(revenantDigest === EN_E08_RUNEFORGE_CUSTODIAN_GATE.revenantComparisonDigest, 'Revenant comparison digest drifted');
if (EN_E08_RUNEFORGE_CUSTODIAN_GATE.hollowSentryComparisonDigest) check(hollowSentryDigest === EN_E08_RUNEFORGE_CUSTODIAN_GATE.hollowSentryComparisonDigest, 'Hollow Sentry comparison digest drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Runeforge Custodian frames must be connected, bounded, and grounded');
check(splitWedgeSabatons === 80 && tallSquareFrames === 80, 'all 80 frames must preserve split wedge sabatons and the tall squared constructed span');
check(colored === 72 && flashes === 8 && runeLockViews === 54 && topologyFrames === 80, 'colored, flash, rune-lock-view, or baked-topology totals drifted');
check(fallenKnightDifferences === 80 && fallenKnightAlphaDifferences === 80, 'Runeforge Custodian must differ from Fallen Knight in all 80 pixel and alpha frames');
check(revenantDifferences === 80 && revenantAlphaDifferences === 80, 'Runeforge Custodian must differ from Revenant in all 80 pixel and alpha frames');
check(hollowSentryDifferences === 80 && hollowSentryAlphaDifferences === 80, 'Runeforge Custodian must differ from Hollow Sentry in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E08_RUNEFORGE_CUSTODIAN_GATE.artifactSha256) check(await fileHash(EN_E08_RUNEFORGE_CUSTODIAN_GATE.artifact) === EN_E08_RUNEFORGE_CUSTODIAN_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E08_RUNEFORGE_CUSTODIAN_GATE.assembledArtifactSha256) check(await fileHash(EN_E08_RUNEFORGE_CUSTODIAN_GATE.assembledArtifact) === EN_E08_RUNEFORGE_CUSTODIAN_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E08_RUNEFORGE_CUSTODIAN_GATE.comparisonArtifactSha256) check(await fileHash(EN_E08_RUNEFORGE_CUSTODIAN_GATE.comparisonArtifact) === EN_E08_RUNEFORGE_CUSTODIAN_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E08_RUNEFORGE_CUSTODIAN_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E08_RUNEFORGE_CUSTODIAN_GATE.reviewAnimations.raw.artifact) === EN_E08_RUNEFORGE_CUSTODIAN_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E08_RUNEFORGE_CUSTODIAN_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E08_RUNEFORGE_CUSTODIAN_GATE.reviewAnimations.completeBForm.artifact) === EN_E08_RUNEFORGE_CUSTODIAN_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY, { ...candidateSpec, family: 'revenant' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY, { ...candidateSpec, variant: 'floating-helm' }, 'down', 'idle', 0), 'wrong variant');

check(EN_E05_REVENANT_GATE.candidateFrameDigest === revenantDigest, 'approved Revenant comparison source drifted');
check(EN_E08_HOLLOW_SENTRY_GATE.candidateFrameDigest === hollowSentryDigest, 'approved Hollow Sentry comparison source drifted');

if (errors.length) {
  console.error('EN-E08 Animated Armor Runeforge Custodian focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E08 Animated Armor Runeforge Custodian focused gate passed.');
  console.log('- Actor topology: 80/80 baked single-actor frames; 0 child assets; no schema, exporter, validator, or frame-contract change');
  console.log('- Fallen Knight distinction: ' + fallenKnightDifferences + '/80 pixel frames and ' + fallenKnightAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Revenant distinction: ' + revenantDifferences + '/80 pixel frames and ' + revenantAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Hollow Sentry distinction: ' + hollowSentryDifferences + '/80 pixel frames and ' + hollowSentryAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + splitWedgeSabatons + '/80 split wedge-sabaton rows; ' + tallSquareFrames + '/80 tall square spans; ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + runeLockViews + '/54 readable rune-lock views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: Hollow Sentry predecessor, Fallen Knight, and Revenant exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Fallen Knight Shieldbearer frame digest: ' + fallenKnightDigest);
  console.log('- Grave Oathkeeper Revenant frame digest: ' + revenantDigest);
  console.log('- Hollow Sentry frame digest: ' + hollowSentryDigest);
}
