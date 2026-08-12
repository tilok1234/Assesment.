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
  EN_E08_CROWNMAW_GREATBLADE_GATE,
  EN_E08_CROWNMAW_GREATBLADE_REGISTRY,
} from '../engine/enemy-expansion-en-e08-living-weapon-crownmaw-greatblade.js';
import {
  EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION,
  EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD,
  EN_E09_BRASSCOIL_SENTRY_CONTRACT,
  EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD,
  EN_E09_BRASSCOIL_SENTRY_DATA,
  EN_E09_BRASSCOIL_SENTRY_DEATH_SOURCE_FRAMES,
  EN_E09_BRASSCOIL_SENTRY_FAMILY,
  EN_E09_BRASSCOIL_SENTRY_GATE,
  EN_E09_BRASSCOIL_SENTRY_REGISTRY,
} from '../engine/enemy-expansion-en-e09-clockwork-automaton-brasscoil-sentry.js';
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
const candidateSpec = { kind: 'enemy', family: 'clockwork-automaton', variant: 'brasscoil-sentry' };
const fallenKnightSpec = { kind: 'enemy', family: 'fallen-knight', variant: 'shieldbearer' };
const runeforgeSpec = { kind: 'enemy', family: 'animated-armor', variant: 'runeforge-custodian' };
const crownmawSpec = { kind: 'enemy', family: 'living-weapon', variant: 'crownmaw-greatblade' };

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
  EN_E09_BRASSCOIL_SENTRY_GATE.status === 'approved'
    && EN_E09_BRASSCOIL_SENTRY_GATE.baseCheckpoint === '165dd2a82adabcf87f5c26b12a2c55da893e9718'
    && EN_E09_BRASSCOIL_SENTRY_GATE.authorizedOn === '2026-08-12'
    && EN_E09_BRASSCOIL_SENTRY_GATE.authorizationEvidence.includes('then replied: lets do next')
    && EN_E09_BRASSCOIL_SENTRY_GATE.authorizationEvidence.includes('only one private common Brasscoil Sentry')
    && EN_E09_BRASSCOIL_SENTRY_GATE.architectureDecision === EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.id
    && EN_E09_BRASSCOIL_SENTRY_GATE.approvedOn === '2026-08-12'
    && EN_E09_BRASSCOIL_SENTRY_GATE.approvalEvidence.includes('designer replied: approved, and you can commit and push everything we approved')
    && EN_E09_BRASSCOIL_SENTRY_GATE.approvalEvidence.includes('2ce7599bdfeb97ccf99f986f5bf842a5ada7fb4cb3d0605a566c1d1263a111cd')
    && EN_E09_BRASSCOIL_SENTRY_GATE.approvedImplementation === 'b109e3d8ba81d444edc3c7ce7e8a479eb37a183e'
    && EN_E09_BRASSCOIL_SENTRY_GATE.publicationAuthorizedOn === '2026-08-12'
    && EN_E09_BRASSCOIL_SENTRY_GATE.publishedImplementation === null
    && EN_E09_BRASSCOIL_SENTRY_GATE.publishedApprovalRecord === null
    && EN_E09_BRASSCOIL_SENTRY_GATE.initialPublishedHandoff === null
    && EN_E09_BRASSCOIL_SENTRY_GATE.publicationState === 'approved-not-published'
    && EN_E09_BRASSCOIL_SENTRY_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E09_BRASSCOIL_SENTRY_GATE.publicationAuthorizationEvidence.includes('pull request'),
  'Brasscoil Sentry authorization or unpublished gate drifted',
);
check(
  EN_E09_BRASSCOIL_SENTRY_GATE.precedingApproval.gateId === EN_E08_CROWNMAW_GREATBLADE_GATE.id
    && EN_E09_BRASSCOIL_SENTRY_GATE.precedingApproval.candidateFrameDigest === EN_E08_CROWNMAW_GREATBLADE_GATE.candidateFrameDigest
    && EN_E09_BRASSCOIL_SENTRY_GATE.precedingApproval.publishedImplementation === EN_E08_CROWNMAW_GREATBLADE_GATE.publishedImplementation
    && EN_E09_BRASSCOIL_SENTRY_GATE.precedingApproval.publishedApprovalRecord === EN_E08_CROWNMAW_GREATBLADE_GATE.publishedApprovalRecord
    && EN_E09_BRASSCOIL_SENTRY_GATE.precedingApproval.initialPublishedHandoff === EN_E08_CROWNMAW_GREATBLADE_GATE.initialPublishedHandoff
    && EN_E09_BRASSCOIL_SENTRY_GATE.precedingApproval.currentReconciliation === '165dd2a82adabcf87f5c26b12a2c55da893e9718'
    && EN_E09_BRASSCOIL_SENTRY_GATE.precedingApproval.reconciliationPublication === 'published',
  'approved Crownmaw predecessor drifted',
);
check(
  EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD.priorityFirst.includes('clockwork-automaton')
    && EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD.effectBoundary.includes('Gear sparks')
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.precedingVariant.id === 'crownmaw-greatblade'
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.activeVariant.id === 'brasscoil-sentry'
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.activeVariant.identity === 'boiler-gear-piston-default'
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.activeVariant.status === 'implemented-full-awaiting-visual-approval'
    && JSON.stringify(EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite'])
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.actorTopology === 'baked-single-actor',
  'Clockwork Automaton collision ruling, role order, or topology boundary drifted',
);
check(
  EN_E09_BRASSCOIL_SENTRY_CONTRACT.state === 'implemented-complete-motion-awaiting-visual-approval'
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT.topology === 'baked-single-actor'
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT.silhouette.includes('small lens pod')
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT.silhouette.includes('one exposed connected gear')
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT.silhouette.includes('connected rear winding key')
    && EN_E09_BRASSCOIL_SENTRY_CONTRACT.visualIdentity.includes('No visor')
    && EN_E09_BRASSCOIL_SENTRY_DATA.actorTopology === 'baked-single-actor'
    && EN_E09_BRASSCOIL_SENTRY_DATA.childAssets.length === 0
    && EN_E09_BRASSCOIL_SENTRY_DATA.bakedEffects.length === 0,
  'Brasscoil Sentry constructed identity, topology, or effect firewall drifted',
);
check(
  EN_E09_BRASSCOIL_SENTRY_GATE.scope.includes('complete 80-frame Brasscoil Sentry common Clockwork Automaton')
    && EN_E09_BRASSCOIL_SENTRY_GATE.animationContract.includes('four weighted piston steps')
    && EN_E09_BRASSCOIL_SENTRY_GATE.animationContract.includes('body-owned piston punch')
    && EN_E09_BRASSCOIL_SENTRY_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E09_BRASSCOIL_SENTRY_GATE.nextGate.includes('visually approved at implementation b109e3d8ba81d444edc3c7ce7e8a479eb37a183e')
    && EN_E09_BRASSCOIL_SENTRY_GATE.nextGate.includes('approval record, branch push, and handoff reconciliation')
    && EN_E09_BRASSCOIL_SENTRY_GATE.nextGate.includes('inspect the live roadmap'),
  'full-suite, motion, or stop-gate contract drifted',
);
check(
  EN_E09_BRASSCOIL_SENTRY_GATE.exclusions.includes('public Clockwork Automaton registration')
    && EN_E09_BRASSCOIL_SENTRY_GATE.exclusions.includes('schema changes')
    && EN_E09_BRASSCOIL_SENTRY_GATE.exclusions.includes('deterministic child/state exports')
    && EN_E09_BRASSCOIL_SENTRY_GATE.exclusions.includes('runtime attachment offsets')
    && EN_E09_BRASSCOIL_SENTRY_GATE.exclusions.includes('handheld weapon or shield')
    && EN_E09_BRASSCOIL_SENTRY_GATE.exclusions.includes('detached gears or winding keys')
    && EN_E09_BRASSCOIL_SENTRY_GATE.exclusions.includes('accepted drift'),
  'EN-E09 scope exclusions drifted',
);
check(
  Object.isFrozen(EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD)
    && Object.isFrozen(EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD)
    && Object.isFrozen(EN_E09_BRASSCOIL_SENTRY_CONTRACT)
    && Object.isFrozen(EN_E09_BRASSCOIL_SENTRY_DATA)
    && Object.isFrozen(EN_E09_BRASSCOIL_SENTRY_GATE),
  'architecture decision, gate, data, and contracts must be deeply immutable',
);
check(
  EN_E09_BRASSCOIL_SENTRY_REGISTRY.families.length === 1
    && EN_E09_BRASSCOIL_SENTRY_REGISTRY.publicFamilies.length === 0
    && EN_E09_BRASSCOIL_SENTRY_FAMILY.variants.length === 1,
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
check(engine.EN_E09_BRASSCOIL_SENTRY_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('clockwork-automaton'), 'public expansion registry must not mention Clockwork Automaton');
check(!manifestSource.includes('clockwork-automaton'), 'asset manifest must not mention Clockwork Automaton');

const captures = new Map();
const candidateRecords = [];
const fallenKnightRecords = [];
const runeforgeRecords = [];
const crownmawRecords = [];
const palettes = [
  ['brass', new Set(EN_E09_BRASSCOIL_SENTRY_DATA.brasscoilSentry.brass)],
  ['iron', new Set(EN_E09_BRASSCOIL_SENTRY_DATA.brasscoilSentry.iron)],
  ['coil', new Set(EN_E09_BRASSCOIL_SENTRY_DATA.brasscoilSentry.coil)],
  ['joint', new Set(EN_E09_BRASSCOIL_SENTRY_DATA.brasscoilSentry.joint)],
  ['cavity', new Set(EN_E09_BRASSCOIL_SENTRY_DATA.brasscoilSentry.cavity)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let broadFeet = 0;
let squatMachineFrames = 0;
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
let crownmawDifferences = 0;
let crownmawAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const frameKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E09_BRASSCOIL_SENTRY_REGISTRY, candidateSpec, direction, animation.id, frame);
    const fallenKnight = captureEnemyExpansionFrame(EN_E01_PUBLIC_REGISTRY, fallenKnightSpec, direction, animation.id, frame);
    const runeforge = captureEnemyExpansionFrame(EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY, runeforgeSpec, direction, animation.id, frame);
    const crownmaw = captureEnemyExpansionFrame(EN_E08_CROWNMAW_GREATBLADE_REGISTRY, crownmawSpec, direction, animation.id, frame);
    captures.set(frameKey, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    fallenKnightRecords.push(frameRecord(fallenKnight, fallenKnightSpec, direction, animation.id, frame));
    runeforgeRecords.push(frameRecord(runeforge, runeforgeSpec, direction, animation.id, frame));
    crownmawRecords.push(frameRecord(crownmaw, crownmawSpec, direction, animation.id, frame));

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
    check(candidate.opaquePixels >= 150 && candidate.opaquePixels <= 300, frameKey + ' density is implausible for a squat boiler automaton');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (rowRuns(candidate.pixels, 22) >= 2) broadFeet++;
    else check(false, frameKey + ' lost the two separated broad feet');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    if (width >= 14 && height >= 18) squatMachineFrames++;
    else check(false, frameKey + ' lost the squat wide mechanical span');

    if (candidate.digest !== fallenKnight.digest) fallenKnightDifferences++;
    if (candidate.alphaDigest !== fallenKnight.alphaDigest) fallenKnightAlphaDifferences++;
    if (candidate.digest !== runeforge.digest) runeforgeDifferences++;
    if (candidate.alphaDigest !== runeforge.alphaDigest) runeforgeAlphaDifferences++;
    if (candidate.digest !== crownmaw.digest) crownmawDifferences++;
    if (candidate.alphaDigest !== crownmaw.alphaDigest) crownmawAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), frameKey + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, frameKey + ' lost ' + name + ' palette identity');
      const aperture = countColors(candidate.pixels, new Set([EN_E09_BRASSCOIL_SENTRY_DATA.brasscoilSentry.lens]));
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
      candidate.renderResult.brasscoilSentryGate === EN_E09_BRASSCOIL_SENTRY_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E08_CROWNMAW_GREATBLADE_GATE.id
        && candidate.renderResult.actorTopology === 'baked-single-actor'
        && candidate.renderResult.childAssetCount === 0
    ) topologyFrames++;
    else check(false, frameKey + ' baked topology metadata drifted');

    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E09_BRASSCOIL_SENTRY_DATA);
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
  const hurt = captures.get(direction + '/hurt/' + EN_E09_BRASSCOIL_SENTRY_DEATH_SOURCE_FRAMES[frame]);
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
const crownmawDigest = hashJson(crownmawRecords);
if (EN_E09_BRASSCOIL_SENTRY_GATE.candidateFrameDigest) check(candidateDigest === EN_E09_BRASSCOIL_SENTRY_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E09_BRASSCOIL_SENTRY_GATE.fallenKnightComparisonDigest) check(fallenKnightDigest === EN_E09_BRASSCOIL_SENTRY_GATE.fallenKnightComparisonDigest, 'Fallen Knight comparison digest drifted');
if (EN_E09_BRASSCOIL_SENTRY_GATE.runeforgeComparisonDigest) check(runeforgeDigest === EN_E09_BRASSCOIL_SENTRY_GATE.runeforgeComparisonDigest, 'Runeforge comparison digest drifted');
if (EN_E09_BRASSCOIL_SENTRY_GATE.crownmawComparisonDigest) check(crownmawDigest === EN_E09_BRASSCOIL_SENTRY_GATE.crownmawComparisonDigest, 'Crownmaw comparison digest drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Brasscoil Sentry frames must be connected, bounded, and grounded');
check(broadFeet === 80 && squatMachineFrames === 80, 'all 80 frames must preserve separated broad feet and the squat wide machine span');
check(colored === 72 && flashes === 8 && lensViews === 54 && topologyFrames === 80, 'colored, flash, lens-view, or baked-topology totals drifted');
check(fallenKnightDifferences === 80 && fallenKnightAlphaDifferences === 80, 'Brasscoil Sentry must differ from Fallen Knight in all 80 pixel and alpha frames');
check(runeforgeDifferences === 80 && runeforgeAlphaDifferences === 80, 'Brasscoil Sentry must differ from Runeforge in all 80 pixel and alpha frames');
check(crownmawDifferences === 80 && crownmawAlphaDifferences === 80, 'Brasscoil Sentry must differ from Crownmaw in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E09_BRASSCOIL_SENTRY_GATE.artifactSha256) check(await fileHash(EN_E09_BRASSCOIL_SENTRY_GATE.artifact) === EN_E09_BRASSCOIL_SENTRY_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E09_BRASSCOIL_SENTRY_GATE.assembledArtifactSha256) check(await fileHash(EN_E09_BRASSCOIL_SENTRY_GATE.assembledArtifact) === EN_E09_BRASSCOIL_SENTRY_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E09_BRASSCOIL_SENTRY_GATE.comparisonArtifactSha256) check(await fileHash(EN_E09_BRASSCOIL_SENTRY_GATE.comparisonArtifact) === EN_E09_BRASSCOIL_SENTRY_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E09_BRASSCOIL_SENTRY_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E09_BRASSCOIL_SENTRY_GATE.reviewAnimations.raw.artifact) === EN_E09_BRASSCOIL_SENTRY_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E09_BRASSCOIL_SENTRY_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E09_BRASSCOIL_SENTRY_GATE.reviewAnimations.completeBForm.artifact) === EN_E09_BRASSCOIL_SENTRY_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E09_BRASSCOIL_SENTRY_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E09_BRASSCOIL_SENTRY_REGISTRY, { ...candidateSpec, family: 'revenant' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E09_BRASSCOIL_SENTRY_REGISTRY, { ...candidateSpec, variant: 'floating-helm' }, 'down', 'idle', 0), 'wrong variant');

check(EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest === runeforgeDigest, 'approved Runeforge comparison source drifted');
check(EN_E08_CROWNMAW_GREATBLADE_GATE.candidateFrameDigest === crownmawDigest, 'approved Crownmaw comparison source drifted');

if (errors.length) {
  console.error('EN-E09 Clockwork Automaton Brasscoil Sentry focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E09 Clockwork Automaton Brasscoil Sentry focused gate passed.');
  console.log('- Actor topology: 80/80 baked single-actor frames; 0 child assets; no schema, exporter, validator, or frame-contract change');
  console.log('- Fallen Knight distinction: ' + fallenKnightDifferences + '/80 pixel frames and ' + fallenKnightAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Runeforge distinction: ' + runeforgeDifferences + '/80 pixel frames and ' + runeforgeAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Crownmaw distinction: ' + crownmawDifferences + '/80 pixel frames and ' + crownmawAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + broadFeet + '/80 broad-foot rows; ' + squatMachineFrames + '/80 squat wide spans; ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + lensViews + '/54 readable lens views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: Crownmaw predecessor, Runeforge, and Fallen Knight exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Fallen Knight Shieldbearer frame digest: ' + fallenKnightDigest);
  console.log('- Runeforge Custodian frame digest: ' + runeforgeDigest);
  console.log('- Crownmaw Greatblade frame digest: ' + crownmawDigest);
}
