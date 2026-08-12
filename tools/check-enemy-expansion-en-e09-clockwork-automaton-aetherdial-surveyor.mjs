import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E01_PUBLIC_REGISTRY } from '../engine/enemy-expansion-en-e01.js';
import {
  EN_E08_RUNEFORGE_CUSTODIAN_GATE,
  EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-runeforge-custodian.js';
import {
  EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD,
  EN_E09_BRASSCOIL_SENTRY_GATE,
  EN_E09_BRASSCOIL_SENTRY_REGISTRY,
  EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e09-clockwork-automaton-brasscoil-sentry.js';
import {
  EN_E09_AETHERDIAL_SURVEYOR_CONTRACT,
  EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD,
  EN_E09_AETHERDIAL_SURVEYOR_DATA,
  EN_E09_AETHERDIAL_SURVEYOR_DEATH_SOURCE_FRAMES,
  EN_E09_AETHERDIAL_SURVEYOR_FAMILY,
  EN_E09_AETHERDIAL_SURVEYOR_GATE,
  EN_E09_AETHERDIAL_SURVEYOR_REGISTRY,
} from '../engine/enemy-expansion-en-e09-clockwork-automaton-aetherdial-surveyor.js';
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
const candidateSpec = { kind: 'enemy', family: 'clockwork-automaton', variant: 'aetherdial-surveyor' };
const fallenKnightSpec = { kind: 'enemy', family: 'fallen-knight', variant: 'shieldbearer' };
const runeforgeSpec = { kind: 'enemy', family: 'animated-armor', variant: 'runeforge-custodian' };
const brasscoilSpec = { kind: 'enemy', family: 'clockwork-automaton', variant: 'brasscoil-sentry' };

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
  EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.status === 'selected'
    && EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected === 'baked-single-actor'
    && EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selectedOn === '2026-08-12'
    && EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.baseCheckpoint === '165dd2a82adabcf87f5c26b12a2c55da893e9718'
    && EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selectionEvidence.includes('then replied: lets do next')
    && EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selectionEvidence.includes('zero child assets')
    && EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.childAssets.length === 0
    && EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.forbidden.includes('detached gears')
    && EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.forbidden.includes('schema changes')
    && EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.reopenRule.includes('new explicit architecture gate'),
  'EN-E09 baked single-actor architecture decision drifted',
);
check(
  EN_E09_AETHERDIAL_SURVEYOR_GATE.status === 'approved'
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.baseCheckpoint === '8037f0ccbb042bf041e01ecbe18b1c567567e409'
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.authorizedOn === '2026-08-12'
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.authorizationEvidence.includes('designer replied: lets do next')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.authorizationEvidence.includes('only one private specialist Aetherdial Surveyor')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.architectureDecision === EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.id
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.approvedOn === '2026-08-12'
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.approvalEvidence.includes('designer replied: approved')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.approvalEvidence.includes('e42453d23d110a5f4328a67b2beb6a83cb3e6a3ca3f51b2e891a82efd18f3627')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.approvedImplementation === 'f3c06649af346dc8a84edcff7c5cdfd8c0bddb16'
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.publicationAuthorizedOn === '2026-08-12'
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.publishedImplementation === null
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.publishedApprovalRecord === null
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.initialPublishedHandoff === null
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.publicationState === 'approved-not-published'
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.publicationAuthorizationEvidence.includes('pull request'),
  'Aetherdial Surveyor authorization or unpublished gate drifted',
);
check(
  EN_E09_AETHERDIAL_SURVEYOR_GATE.precedingApproval.gateId === EN_E09_BRASSCOIL_SENTRY_GATE.id
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.precedingApproval.candidateFrameDigest === EN_E09_BRASSCOIL_SENTRY_GATE.candidateFrameDigest
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.precedingApproval.publishedImplementation === EN_E09_BRASSCOIL_SENTRY_GATE.publishedImplementation
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.precedingApproval.publishedApprovalRecord === EN_E09_BRASSCOIL_SENTRY_GATE.publishedApprovalRecord
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.precedingApproval.initialPublishedHandoff === EN_E09_BRASSCOIL_SENTRY_GATE.initialPublishedHandoff
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.precedingApproval.currentReconciliation === '8037f0ccbb042bf041e01ecbe18b1c567567e409'
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.precedingApproval.reconciliationPublication === 'published',
  'approved Brasscoil predecessor drifted',
);
check(
  EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD.priorityFirst.includes('clockwork-automaton')
    && EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD.effectBoundary.includes('Gear sparks')
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.precedingVariant.id === 'brasscoil-sentry'
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.activeVariant.id === 'aetherdial-surveyor'
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.activeVariant.identity === 'cyclopean-dial-coil-projector-surveyor'
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.activeVariant.status === 'implemented-full-awaiting-visual-approval'
    && JSON.stringify(EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.deferredRoles) === JSON.stringify(['elite'])
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.actorTopology === 'baked-single-actor',
  'Clockwork Automaton collision ruling, role order, or topology boundary drifted',
);
check(
  EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.state === 'implemented-complete-motion-awaiting-visual-approval'
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.topology === 'baked-single-actor'
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.silhouette.includes('tuning-fork crown')
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.silhouette.includes('exposed chest flywheel')
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.silhouette.includes('integrated projector forearm')
    && EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.visualIdentity.includes('No visor')
    && EN_E09_AETHERDIAL_SURVEYOR_DATA.actorTopology === 'baked-single-actor'
    && EN_E09_AETHERDIAL_SURVEYOR_DATA.childAssets.length === 0
    && EN_E09_AETHERDIAL_SURVEYOR_DATA.bakedEffects.length === 0,
  'Aetherdial Surveyor constructed identity, topology, or effect firewall drifted',
);
check(
  EN_E09_AETHERDIAL_SURVEYOR_GATE.scope.includes('complete 80-frame Aetherdial Surveyor specialist Clockwork Automaton')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.animationContract.includes('four tall piston strides')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.animationContract.includes('body-owned recoil with no projectile pixels')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.nextGate.includes('visually approved at implementation f3c06649af346dc8a84edcff7c5cdfd8c0bddb16')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.nextGate.includes('approval record, branch push, and handoff reconciliation')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.nextGate.includes('inspect the live roadmap'),
  'full-suite, motion, or stop-gate contract drifted',
);
check(
  EN_E09_AETHERDIAL_SURVEYOR_GATE.exclusions.includes('public Clockwork Automaton registration')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.exclusions.includes('schema changes')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.exclusions.includes('deterministic child/state exports')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.exclusions.includes('runtime attachment offsets')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.exclusions.includes('handheld weapon or shield')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.exclusions.includes('detached gears or winding keys')
    && EN_E09_AETHERDIAL_SURVEYOR_GATE.exclusions.includes('accepted drift'),
  'EN-E09 scope exclusions drifted',
);
check(
  Object.isFrozen(EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD)
    && Object.isFrozen(EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD)
    && Object.isFrozen(EN_E09_AETHERDIAL_SURVEYOR_CONTRACT)
    && Object.isFrozen(EN_E09_AETHERDIAL_SURVEYOR_DATA)
    && Object.isFrozen(EN_E09_AETHERDIAL_SURVEYOR_GATE),
  'architecture decision, gate, data, and contracts must be deeply immutable',
);
check(
  EN_E09_AETHERDIAL_SURVEYOR_REGISTRY.families.length === 1
    && EN_E09_AETHERDIAL_SURVEYOR_REGISTRY.publicFamilies.length === 0
    && EN_E09_AETHERDIAL_SURVEYOR_FAMILY.variants.length === 1,
  'candidate registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'clockwork-automaton'),
  'candidate must preserve public 80/259 and keep Clockwork Automaton private',
);
check(engine.EN_E09_AETHERDIAL_SURVEYOR_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('clockwork-automaton'), 'public expansion registry must not mention Clockwork Automaton');
check(!manifestSource.includes('clockwork-automaton'), 'asset manifest must not mention Clockwork Automaton');

const captures = new Map();
const candidateRecords = [];
const fallenKnightRecords = [];
const runeforgeRecords = [];
const brasscoilRecords = [];
const palettes = [
  ['verdigris', new Set(EN_E09_AETHERDIAL_SURVEYOR_DATA.aetherdialSurveyor.verdigris)],
  ['brass', new Set(EN_E09_AETHERDIAL_SURVEYOR_DATA.aetherdialSurveyor.brass)],
  ['iron', new Set(EN_E09_AETHERDIAL_SURVEYOR_DATA.aetherdialSurveyor.iron)],
  ['coil', new Set(EN_E09_AETHERDIAL_SURVEYOR_DATA.aetherdialSurveyor.coil)],
  ['joint', new Set(EN_E09_AETHERDIAL_SURVEYOR_DATA.aetherdialSurveyor.joint)],
  ['cavity', new Set(EN_E09_AETHERDIAL_SURVEYOR_DATA.aetherdialSurveyor.cavity)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let plantedTripod = 0;
let tallSurveyorFrames = 0;
let colored = 0;
let flashes = 0;
let lensViews = 0;
let topologyFrames = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let fallenKnightDifferences = 0;
let fallenKnightAlphaDifferences = 0;
let runeforgeDifferences = 0;
let runeforgeAlphaDifferences = 0;
let brasscoilDifferences = 0;
let brasscoilAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const frameKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E09_AETHERDIAL_SURVEYOR_REGISTRY, candidateSpec, direction, animation.id, frame);
    const fallenKnight = captureEnemyExpansionFrame(EN_E01_PUBLIC_REGISTRY, fallenKnightSpec, direction, animation.id, frame);
    const runeforge = captureEnemyExpansionFrame(EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY, runeforgeSpec, direction, animation.id, frame);
    const brasscoil = captureEnemyExpansionFrame(EN_E09_BRASSCOIL_SENTRY_REGISTRY, brasscoilSpec, direction, animation.id, frame);
    captures.set(frameKey, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    fallenKnightRecords.push(frameRecord(fallenKnight, fallenKnightSpec, direction, animation.id, frame));
    runeforgeRecords.push(frameRecord(runeforge, runeforgeSpec, direction, animation.id, frame));
    brasscoilRecords.push(frameRecord(brasscoil, brasscoilSpec, direction, animation.id, frame));

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
    check(candidate.opaquePixels >= 130 && candidate.opaquePixels <= 300, frameKey + ' density is implausible for a tall optical automaton');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footPixels = candidate.pixels.slice(22 * 24, 23 * 24).filter(Boolean).length;
    if (footPixels >= 12) plantedTripod++;
    else check(false, frameKey + ' lost the planted three-prong foot span');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    if (width >= 17 && height >= 20) tallSurveyorFrames++;
    else check(false, frameKey + ' lost the tall surveyor mechanical span');

    if (candidate.digest !== fallenKnight.digest) fallenKnightDifferences++;
    if (candidate.alphaDigest !== fallenKnight.alphaDigest) fallenKnightAlphaDifferences++;
    if (candidate.digest !== runeforge.digest) runeforgeDifferences++;
    if (candidate.alphaDigest !== runeforge.alphaDigest) runeforgeAlphaDifferences++;
    if (candidate.digest !== brasscoil.digest) brasscoilDifferences++;
    if (candidate.alphaDigest !== brasscoil.alphaDigest) brasscoilAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), frameKey + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, frameKey + ' lost ' + name + ' palette identity');
      const aperture = countColors(candidate.pixels, new Set([EN_E09_AETHERDIAL_SURVEYOR_DATA.aetherdialSurveyor.lens]));
      if (direction === 'up') {
        check(aperture === 0, frameKey + ' rear view must not expose the front lens');
      } else if (direction === 'down') {
        check(aperture === 4, frameKey + ' front view must preserve one readable four-pixel lens');
        lensViews++;
      } else {
        check(aperture === 4, frameKey + ' side view must preserve one readable profile lens');
        lensViews++;
      }
      colored++;
    }

    if (
      candidate.renderResult.aetherdialSurveyorGate === EN_E09_AETHERDIAL_SURVEYOR_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E09_BRASSCOIL_SENTRY_GATE.id
        && candidate.renderResult.actorTopology === 'baked-single-actor'
        && candidate.renderResult.childAssetCount === 0
    ) topologyFrames++;
    else check(false, frameKey + ' baked topology metadata drifted');

    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E09_AETHERDIAL_SURVEYOR_DATA);
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
  const hurt = captures.get(direction + '/hurt/' + EN_E09_AETHERDIAL_SURVEYOR_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const candidateDigest = hashJson(candidateRecords);
const fallenKnightDigest = hashJson(fallenKnightRecords);
const runeforgeDigest = hashJson(runeforgeRecords);
const brasscoilDigest = hashJson(brasscoilRecords);
if (EN_E09_AETHERDIAL_SURVEYOR_GATE.candidateFrameDigest) check(candidateDigest === EN_E09_AETHERDIAL_SURVEYOR_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E09_AETHERDIAL_SURVEYOR_GATE.fallenKnightComparisonDigest) check(fallenKnightDigest === EN_E09_AETHERDIAL_SURVEYOR_GATE.fallenKnightComparisonDigest, 'Fallen Knight comparison digest drifted');
if (EN_E09_AETHERDIAL_SURVEYOR_GATE.runeforgeComparisonDigest) check(runeforgeDigest === EN_E09_AETHERDIAL_SURVEYOR_GATE.runeforgeComparisonDigest, 'Runeforge comparison digest drifted');
if (EN_E09_AETHERDIAL_SURVEYOR_GATE.brasscoilComparisonDigest) check(brasscoilDigest === EN_E09_AETHERDIAL_SURVEYOR_GATE.brasscoilComparisonDigest, 'Brasscoil comparison digest drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Aetherdial Surveyor frames must be connected, bounded, and grounded');
check(plantedTripod === 80 && tallSurveyorFrames === 80, 'all 80 frames must preserve the planted three-prong feet and tall surveyor span');
check(colored === 72 && flashes === 8 && lensViews === 54 && topologyFrames === 80, 'colored, flash, lens-view, or baked-topology totals drifted');
check(fallenKnightDifferences === 80 && fallenKnightAlphaDifferences === 80, 'Aetherdial Surveyor must differ from Fallen Knight in all 80 pixel and alpha frames');
check(runeforgeDifferences === 80 && runeforgeAlphaDifferences === 80, 'Aetherdial Surveyor must differ from Runeforge in all 80 pixel and alpha frames');
check(brasscoilDifferences === 80 && brasscoilAlphaDifferences === 80, 'Aetherdial Surveyor must differ from Brasscoil in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E09_AETHERDIAL_SURVEYOR_GATE.artifactSha256) check(await fileHash(EN_E09_AETHERDIAL_SURVEYOR_GATE.artifact) === EN_E09_AETHERDIAL_SURVEYOR_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E09_AETHERDIAL_SURVEYOR_GATE.assembledArtifactSha256) check(await fileHash(EN_E09_AETHERDIAL_SURVEYOR_GATE.assembledArtifact) === EN_E09_AETHERDIAL_SURVEYOR_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E09_AETHERDIAL_SURVEYOR_GATE.comparisonArtifactSha256) check(await fileHash(EN_E09_AETHERDIAL_SURVEYOR_GATE.comparisonArtifact) === EN_E09_AETHERDIAL_SURVEYOR_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E09_AETHERDIAL_SURVEYOR_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E09_AETHERDIAL_SURVEYOR_GATE.reviewAnimations.raw.artifact) === EN_E09_AETHERDIAL_SURVEYOR_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E09_AETHERDIAL_SURVEYOR_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E09_AETHERDIAL_SURVEYOR_GATE.reviewAnimations.completeBForm.artifact) === EN_E09_AETHERDIAL_SURVEYOR_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E09_AETHERDIAL_SURVEYOR_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E09_AETHERDIAL_SURVEYOR_REGISTRY, { ...candidateSpec, family: 'revenant' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E09_AETHERDIAL_SURVEYOR_REGISTRY, { ...candidateSpec, variant: 'floating-helm' }, 'down', 'idle', 0), 'wrong variant');

check(EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest === runeforgeDigest, 'approved Runeforge comparison source drifted');
check(EN_E09_BRASSCOIL_SENTRY_GATE.candidateFrameDigest === brasscoilDigest, 'approved Brasscoil comparison source drifted');

if (errors.length) {
  console.error('EN-E09 Clockwork Automaton Aetherdial Surveyor focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E09 Clockwork Automaton Aetherdial Surveyor focused gate passed.');
  console.log('- Actor topology: 80/80 baked single-actor frames; 0 child assets; no schema, exporter, validator, or frame-contract change');
  console.log('- Fallen Knight distinction: ' + fallenKnightDifferences + '/80 pixel frames and ' + fallenKnightAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Runeforge distinction: ' + runeforgeDifferences + '/80 pixel frames and ' + runeforgeAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Brasscoil distinction: ' + brasscoilDifferences + '/80 pixel frames and ' + brasscoilAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + plantedTripod + '/80 planted foot spans; ' + tallSurveyorFrames + '/80 tall surveyor spans; ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + lensViews + '/54 readable lens views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: Brasscoil predecessor, Runeforge, and Fallen Knight exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Fallen Knight Shieldbearer frame digest: ' + fallenKnightDigest);
  console.log('- Runeforge Custodian frame digest: ' + runeforgeDigest);
  console.log('- Brasscoil Sentry frame digest: ' + brasscoilDigest);
}
