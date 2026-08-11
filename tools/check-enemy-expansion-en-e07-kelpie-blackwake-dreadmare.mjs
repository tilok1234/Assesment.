import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_COMMON_ALIAS_REGISTRY } from '../engine/enemy-expansion-en-e03-common-aliases.js';
import {
  EN_E07_KELPIE_CONTRACT_CARD,
  EN_E07_MIREMANE_COURSER_GATE,
  EN_E07_MIREMANE_COURSER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-kelpie-miremane-courser.js';
import {
  EN_E07_DROWNBRIDLE_STALKER_CONTRACT_CARD,
  EN_E07_DROWNBRIDLE_STALKER_GATE,
  EN_E07_DROWNBRIDLE_STALKER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-kelpie-drownbridle-stalker.js';
import {
  EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD,
  EN_E07_BLACKWAKE_DREADMARE_CONTRACT,
  EN_E07_BLACKWAKE_DREADMARE_DATA,
  EN_E07_BLACKWAKE_DREADMARE_DEATH_SOURCE_FRAMES,
  EN_E07_BLACKWAKE_DREADMARE_FAMILY,
  EN_E07_BLACKWAKE_DREADMARE_GATE,
  EN_E07_BLACKWAKE_DREADMARE_REGISTRY,
} from '../engine/enemy-expansion-en-e07-kelpie-blackwake-dreadmare.js';
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
const candidateSpec = { kind: 'enemy', family: 'kelpie', variant: 'blackwake-dreadmare' };
const drownbridleSpec = { kind: 'enemy', family: 'kelpie', variant: 'drownbridle-stalker' };
const miremaneSpec = { kind: 'enemy', family: 'kelpie', variant: 'miremane-courser' };
const steppeHunterSpec = { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' };

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
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = (ny * 24) + nx;
        if (nx >= 0 && ny >= 0 && nx < 24 && ny < 24 && occupied.delete(next)) queue.push(next);
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
  EN_E07_BLACKWAKE_DREADMARE_GATE.status === 'approved'
    && EN_E07_BLACKWAKE_DREADMARE_GATE.authorizedOn === '2026-08-11'
    && EN_E07_BLACKWAKE_DREADMARE_GATE.approvedOn === '2026-08-11'
    && EN_E07_BLACKWAKE_DREADMARE_GATE.approvedImplementation === '3a3ffce6997a6cc9735b818e13573b9085229555'
    && EN_E07_BLACKWAKE_DREADMARE_GATE.publicationAuthorizedOn === '2026-08-11'
    && EN_E07_BLACKWAKE_DREADMARE_GATE.publishedImplementation === null
    && EN_E07_BLACKWAKE_DREADMARE_GATE.publishedApprovalRecord === null
    && EN_E07_BLACKWAKE_DREADMARE_GATE.initialPublishedHandoff === null
    && EN_E07_BLACKWAKE_DREADMARE_GATE.publicationState === 'authorized-pending-bounded-publication',
  'Blackwake Dreadmare authorized-pending publication state drifted',
);
check(
  EN_E07_BLACKWAKE_DREADMARE_GATE.approvalEvidence.includes('designer replied: approved lets do next')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.approvalEvidence.includes('Aseprite process 27380')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.approvalEvidence.includes('be29daec400cffca3f5822aec3bd6ca37c8139a8783f51c7238b47aa37001172')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.approvalEvidence.includes('EN-E08 architecture decision')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve'),
  'approval evidence or bounded publication authorization drifted',
);
check(
  EN_E07_BLACKWAKE_DREADMARE_GATE.baseCheckpoint === 'f9928aed53cd842b937d396e29ec8d6a7aaa8120'
    && EN_E07_BLACKWAKE_DREADMARE_GATE.authorizationEvidence.includes('designer replied: approved lets do next')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.authorizationEvidence.includes('only one private elite Kelpie Blackwake Dreadmare')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.authorizationEvidence.includes('clean published checkpoint f9928aed53cd842b937d396e29ec8d6a7aaa8120'),
  'authorization evidence or bounded interpretation drifted',
);
check(
  EN_E07_BLACKWAKE_DREADMARE_GATE.precedingApproval.gateId === EN_E07_DROWNBRIDLE_STALKER_GATE.id
    && EN_E07_BLACKWAKE_DREADMARE_GATE.precedingApproval.candidateFrameDigest === EN_E07_DROWNBRIDLE_STALKER_GATE.candidateFrameDigest
    && EN_E07_BLACKWAKE_DREADMARE_GATE.precedingApproval.publishedImplementation === EN_E07_DROWNBRIDLE_STALKER_GATE.publishedImplementation
    && EN_E07_BLACKWAKE_DREADMARE_GATE.precedingApproval.publishedApprovalRecord === EN_E07_DROWNBRIDLE_STALKER_GATE.publishedApprovalRecord
    && EN_E07_BLACKWAKE_DREADMARE_GATE.precedingApproval.initialPublishedHandoff === EN_E07_DROWNBRIDLE_STALKER_GATE.initialPublishedHandoff
    && EN_E07_BLACKWAKE_DREADMARE_GATE.precedingApproval.currentReconciliation === 'f9928aed53cd842b937d396e29ec8d6a7aaa8120'
    && EN_E07_BLACKWAKE_DREADMARE_GATE.precedingApproval.reconciliationPublication === 'published',
  'approved Drownbridle Stalker predecessor drifted',
);
check(
  EN_E07_BLACKWAKE_DREADMARE_GATE.scope.includes('complete 80-frame Blackwake Dreadmare elite Kelpie')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.animationContract.includes('four crushing diagonal hoof phases')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.animationContract.includes('connected shoulder-and-jaw surge')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.animationContract.includes('Cast aliases Attack exactly'),
  'full-suite or motion contract drifted',
);
check(
  EN_E07_BLACKWAKE_DREADMARE_GATE.exclusions.includes('Centaur humanoid torso or rider')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.exclusions.includes('Unicorn horn or crown')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.exclusions.includes('canine Wolf head or raised tail')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.exclusions.includes('armor or barding plates')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.exclusions.includes('public Kelpie registration')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.exclusions.includes('EN-E08 and later work'),
  'scope exclusions drifted',
);
check(
  EN_E07_BLACKWAKE_DREADMARE_GATE.nextGate.includes('implementation 3a3ffce6997a6cc9735b818e13573b9085229555')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.nextGate.includes('approval record a397f3034b9ce894dd7caf971d4b3c1fbc9cb2e6')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.nextGate.includes('remote verified')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.nextGate.includes('initial-handoff and final-reconciliation commits')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.nextGate.includes('EN-E08 actor-topology architecture decision')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.nextGate.includes('do not begin Animated Armor art')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.nextGate.includes('registration')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.nextGate.includes('water effects')
    && EN_E07_BLACKWAKE_DREADMARE_GATE.nextGate.includes('release'),
  'published approval record or EN-E08 architecture gate drifted',
);
check(
  JSON.stringify(EN_E07_KELPIE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E07_DROWNBRIDLE_STALKER_CONTRACT_CARD.activeVariant.id === 'drownbridle-stalker'
    && EN_E07_DROWNBRIDLE_STALKER_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD.precedingVariant.id === 'drownbridle-stalker'
    && EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD.activeVariant.id === 'blackwake-dreadmare'
    && EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E07_BLACKWAKE_DREADMARE_CONTRACT.state === 'implemented-complete-motion-approved'
    && JSON.stringify(EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD.deferredRoles) === JSON.stringify([]),
  'Kelpie role order or elite-only boundary drifted',
);
check(
  EN_E07_BLACKWAKE_DREADMARE_CONTRACT.silhouette.includes('broad rear-heavy grounded elite Kelpie')
    && EN_E07_BLACKWAKE_DREADMARE_CONTRACT.silhouette.includes('connected breaker mane')
    && EN_E07_BLACKWAKE_DREADMARE_CONTRACT.silhouette.includes('four thick separated legs')
    && EN_E07_BLACKWAKE_DREADMARE_CONTRACT.identity.includes('all wake, foam, undertow, and illumination effects remain external')
    && EN_E07_BLACKWAKE_DREADMARE_DATA.bakedEffects.length === 0,
  'Blackwake elite-equine identity or effect firewall drifted',
);
check(
  Object.isFrozen(EN_E07_BLACKWAKE_DREADMARE_GATE)
    && Object.isFrozen(EN_E07_BLACKWAKE_DREADMARE_DATA)
    && Object.isFrozen(EN_E07_BLACKWAKE_DREADMARE_CONTRACT)
    && Object.isFrozen(EN_E07_KELPIE_CONTRACT_CARD)
    && Object.isFrozen(EN_E07_DROWNBRIDLE_STALKER_CONTRACT_CARD)
    && Object.isFrozen(EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD),
  'gate, data, and contracts must be deeply immutable',
);
check(
  EN_E07_BLACKWAKE_DREADMARE_REGISTRY.families.length === 1
    && EN_E07_BLACKWAKE_DREADMARE_REGISTRY.publicFamilies.length === 0
    && EN_E07_BLACKWAKE_DREADMARE_FAMILY.variants.length === 1,
  'candidate registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'kelpie'),
  'candidate must preserve public 80/259 and keep Kelpie private',
);
check(engine.EN_E07_BLACKWAKE_DREADMARE_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('kelpie'), 'public expansion registry must not mention Kelpie');
check(!manifestSource.includes('kelpie'), 'asset manifest must not mention Kelpie');

const captures = new Map();
const candidateRecords = [];
const drownbridleRecords = [];
const miremaneRecords = [];
const steppeHunterRecords = [];
const palettes = [
  ['body', new Set(EN_E07_BLACKWAKE_DREADMARE_DATA.blackwakeDreadmare.body)],
  ['mane', new Set(EN_E07_BLACKWAKE_DREADMARE_DATA.blackwakeDreadmare.mane)],
  ['belly', new Set(EN_E07_BLACKWAKE_DREADMARE_DATA.blackwakeDreadmare.belly)],
  ['wake', new Set(EN_E07_BLACKWAKE_DREADMARE_DATA.blackwakeDreadmare.wake)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let fourHoofRows = 0;
let eliteSpanFrames = 0;
let colored = 0;
let flashes = 0;
let eyeViews = 0;
let readableMuzzleViews = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let drownbridleDifferences = 0;
let drownbridleAlphaDifferences = 0;
let miremaneDifferences = 0;
let miremaneAlphaDifferences = 0;
let steppeHunterDifferences = 0;
let steppeHunterAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E07_BLACKWAKE_DREADMARE_REGISTRY, candidateSpec, direction, animation.id, frame);
    const drownbridle = captureEnemyExpansionFrame(EN_E07_DROWNBRIDLE_STALKER_REGISTRY, drownbridleSpec, direction, animation.id, frame);
    const miremane = captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY, miremaneSpec, direction, animation.id, frame);
    const steppeHunter = captureEnemyExpansionFrame(EN_E03_COMMON_ALIAS_REGISTRY, steppeHunterSpec, direction, animation.id, frame);
    captures.set(key, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    drownbridleRecords.push(frameRecord(drownbridle, drownbridleSpec, direction, animation.id, frame));
    miremaneRecords.push(frameRecord(miremane, miremaneSpec, direction, animation.id, frame));
    steppeHunterRecords.push(frameRecord(steppeHunter, steppeHunterSpec, direction, animation.id, frame));

    check(candidate.outOfBoundsWrites.length === 0, key + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), key + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++;
    else check(false, key + ' must remain one connected actor');
    const isBounded = candidate.bounds
      && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1
      && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++;
    else check(false, key + ' lost the one-cell margin');
    const isGrounded = candidate.bounds && candidate.bounds.maxY === 22;
    if (isGrounded) grounded++;
    else check(false, key + ' lost dark-hoof ground contact');
    check(candidate.opaquePixels >= 240 && candidate.opaquePixels <= 330, key + ' density is implausible for the broad rear-heavy elite Kelpie');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const hoofRuns = rowRuns(candidate.pixels, 22);
    if (hoofRuns >= 4) fourHoofRows++;
    else check(false, key + ' lost four separated grounded hoof runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const eliteSpan = (direction === 'left' || direction === 'right') ? width >= 21 : height >= 19;
    if (eliteSpan) eliteSpanFrames++;
    else check(false, key + ' lost the broad tall elite equine span');

    if (candidate.digest !== drownbridle.digest) drownbridleDifferences++;
    if (candidate.alphaDigest !== drownbridle.alphaDigest) drownbridleAlphaDifferences++;
    if (candidate.digest !== miremane.digest) miremaneDifferences++;
    if (candidate.alphaDigest !== miremane.alphaDigest) miremaneAlphaDifferences++;
    if (candidate.digest !== steppeHunter.digest) steppeHunterDifferences++;
    if (candidate.alphaDigest !== steppeHunter.alphaDigest) steppeHunterAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), key + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, key + ' lost ' + name + ' palette identity');
      check(countColors(candidate.pixels, new Set([EN_E07_BLACKWAKE_DREADMARE_DATA.blackwakeDreadmare.hoof])) >= 4, key + ' lost the dark-hoof identity');
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_BLACKWAKE_DREADMARE_DATA.blackwakeDreadmare.eye]));
      const featureCount = countColors(candidate.pixels, new Set([EN_E07_BLACKWAKE_DREADMARE_DATA.blackwakeDreadmare.feature]));
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0, key + ' rear view must not expose face pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, key + ' front view must preserve a paired marsh-light gaze');
        check(featureCount >= 6, key + ' front view must preserve paired nostrils and a broad mouth');
        eyeViews++;
        readableMuzzleViews++;
      } else {
        check(eyeCount === 1, key + ' side view must preserve one profile marsh-light eye');
        check(featureCount >= 4, key + ' side view must preserve a dark nostril and readable mouth');
        eyeViews++;
        readableMuzzleViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.blackwakeDreadmareGate === EN_E07_BLACKWAKE_DREADMARE_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_DROWNBRIDLE_STALKER_GATE.id,
      key + ' gate metadata drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E07_BLACKWAKE_DREADMARE_DATA);
    completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
    formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
  }
  const uniqueMotion = new Set(animationDigests).size;
  if (animation.id === 'idle' || animation.id === 'hurt' || animation.id === 'death') check(uniqueMotion === 2, direction + ' ' + animation.id + ' must preserve both authored alias phases');
  else check(uniqueMotion >= 3, direction + ' ' + animation.id + ' must preserve distinct motion phases');
}

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame++) {
    const attack = captures.get(direction + '/attack/' + frame);
    const cast = captures.get(direction + '/cast/' + frame);
    check(cast.digest === attack.digest, direction + ' Cast C' + (frame + 1) + ' must alias Attack exactly');
    const death = captures.get(direction + '/death/' + frame);
    const hurt = captures.get(direction + '/hurt/' + EN_E07_BLACKWAKE_DREADMARE_DEATH_SOURCE_FRAMES[frame]);
    check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
  }
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const candidateDigest = hashJson(candidateRecords);
const drownbridleDigest = hashJson(drownbridleRecords);
const miremaneDigest = hashJson(miremaneRecords);
const steppeHunterDigest = hashJson(steppeHunterRecords);
if (EN_E07_BLACKWAKE_DREADMARE_GATE.candidateFrameDigest) check(candidateDigest === EN_E07_BLACKWAKE_DREADMARE_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E07_BLACKWAKE_DREADMARE_GATE.drownbridleComparisonDigest) check(drownbridleDigest === EN_E07_BLACKWAKE_DREADMARE_GATE.drownbridleComparisonDigest, 'Drownbridle Stalker comparison digest drifted');
if (EN_E07_BLACKWAKE_DREADMARE_GATE.miremaneComparisonDigest) check(miremaneDigest === EN_E07_BLACKWAKE_DREADMARE_GATE.miremaneComparisonDigest, 'Miremane Courser comparison digest drifted');
if (EN_E07_BLACKWAKE_DREADMARE_GATE.steppeHunterComparisonDigest) check(steppeHunterDigest === EN_E07_BLACKWAKE_DREADMARE_GATE.steppeHunterComparisonDigest, 'Steppe Hunter comparison digest drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Blackwake Dreadmare frames must be connected, bounded, and grounded');
check(fourHoofRows === 80 && eliteSpanFrames === 80, 'all 80 frames must preserve four separated hoof runs and the broad tall elite equine span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && readableMuzzleViews === 54, 'colored, flash, eye-view, or readable-muzzle totals drifted');
check(drownbridleDifferences === 80 && drownbridleAlphaDifferences === 80, 'Blackwake Dreadmare must differ from Drownbridle Stalker in all 80 pixel and alpha frames');
check(miremaneDifferences === 80 && miremaneAlphaDifferences === 80, 'Blackwake Dreadmare must differ from Miremane Courser in all 80 pixel and alpha frames');
check(steppeHunterDifferences === 80 && steppeHunterAlphaDifferences === 80, 'Blackwake Dreadmare must differ from Steppe Hunter in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E07_BLACKWAKE_DREADMARE_GATE.artifactSha256) check(await fileHash(EN_E07_BLACKWAKE_DREADMARE_GATE.artifact) === EN_E07_BLACKWAKE_DREADMARE_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E07_BLACKWAKE_DREADMARE_GATE.assembledArtifactSha256) check(await fileHash(EN_E07_BLACKWAKE_DREADMARE_GATE.assembledArtifact) === EN_E07_BLACKWAKE_DREADMARE_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E07_BLACKWAKE_DREADMARE_GATE.comparisonArtifactSha256) check(await fileHash(EN_E07_BLACKWAKE_DREADMARE_GATE.comparisonArtifact) === EN_E07_BLACKWAKE_DREADMARE_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E07_BLACKWAKE_DREADMARE_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E07_BLACKWAKE_DREADMARE_GATE.reviewAnimations.raw.artifact) === EN_E07_BLACKWAKE_DREADMARE_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E07_BLACKWAKE_DREADMARE_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E07_BLACKWAKE_DREADMARE_GATE.reviewAnimations.completeBForm.artifact) === EN_E07_BLACKWAKE_DREADMARE_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E07_BLACKWAKE_DREADMARE_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E07_BLACKWAKE_DREADMARE_REGISTRY, { ...candidateSpec, family: 'centaur' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E07_BLACKWAKE_DREADMARE_REGISTRY, { ...candidateSpec, variant: 'horned-courser' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E07 Kelpie Blackwake Dreadmare focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E07 Kelpie Blackwake Dreadmare focused gate passed.');
  console.log('- Drownbridle Stalker distinction: ' + drownbridleDifferences + '/80 pixel frames and ' + drownbridleAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Miremane Courser distinction: ' + miremaneDifferences + '/80 pixel frames and ' + miremaneAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Steppe Hunter distinction: ' + steppeHunterDifferences + '/80 pixel frames and ' + steppeHunterAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + fourHoofRows + '/80 four-hoof rows; ' + eliteSpanFrames + '/80 broad tall elite spans; ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + eyeViews + '/54 expected eye-bearing views; ' + readableMuzzleViews + '/54 readable muzzle views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: approved Drownbridle Stalker, Miremane Courser, and Steppe Hunter exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Approved Drownbridle Stalker frame digest: ' + drownbridleDigest);
  console.log('- Approved Miremane Courser frame digest: ' + miremaneDigest);
  console.log('- Approved Steppe Hunter frame digest: ' + steppeHunterDigest);
}
