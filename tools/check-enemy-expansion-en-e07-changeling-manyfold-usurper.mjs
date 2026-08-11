import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E07_GRAND_PRETENDER_GATE,
  EN_E07_GRAND_PRETENDER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-doppelganger-grand-pretender.js';
import {
  EN_E07_CHANGELING_CONTRACT_CARD,
  EN_E07_VEILSKIN_FOUNDLING_GATE,
  EN_E07_VEILSKIN_FOUNDLING_REGISTRY,
} from '../engine/enemy-expansion-en-e07-changeling-veilskin-foundling.js';
import {
  EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD,
  EN_E07_MIRRORFOLD_HARRIER_GATE,
  EN_E07_MIRRORFOLD_HARRIER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-changeling-mirrorfold-harrier.js';
import {
  EN_E07_MANYFOLD_USURPER_CONTRACT_CARD,
  EN_E07_MANYFOLD_USURPER_CONTRACT,
  EN_E07_MANYFOLD_USURPER_DATA,
  EN_E07_MANYFOLD_USURPER_DEATH_SOURCE_FRAMES,
  EN_E07_MANYFOLD_USURPER_FAMILY,
  EN_E07_MANYFOLD_USURPER_GATE,
  EN_E07_MANYFOLD_USURPER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-changeling-manyfold-usurper.js';
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
const candidateSpec = { kind: 'enemy', family: 'changeling', variant: 'manyfold-usurper' };
const mirrorfoldSpec = { kind: 'enemy', family: 'changeling', variant: 'mirrorfold-harrier' };
const veilskinSpec = { kind: 'enemy', family: 'changeling', variant: 'veilskin-foundling' };
const grandPretenderSpec = { kind: 'enemy', family: 'doppelganger', variant: 'grand-pretender' };

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function frameRecord(captured, spec, direction, animation, frame, candidateFamily = true) {
  return {
    family: spec.family,
    variant: spec.variant,
    ...(candidateFamily ? { candidateFamily: spec.family } : {}),
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

function rowOpaque(pixels, y) {
  return pixels.slice(y * 24, (y + 1) * 24).filter(Boolean).length;
}

function rowOpaqueBetween(pixels, y, minX, maxX) {
  return pixels.slice((y * 24) + minX, (y * 24) + maxX + 1).filter(Boolean).length;
}

function widestUpperRow(pixels) {
  let widest = 0;
  for (let y = 0; y <= 13; y++) widest = Math.max(widest, rowOpaque(pixels, y));
  return widest;
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
  EN_E07_MANYFOLD_USURPER_GATE.status === 'approved'
    && EN_E07_MANYFOLD_USURPER_GATE.approvedOn === '2026-08-11'
    && EN_E07_MANYFOLD_USURPER_GATE.approvedImplementation === '38f9d7f9b3ac5a34bdff91be1fd878e158d26bfe'
    && EN_E07_MANYFOLD_USURPER_GATE.publishedImplementation === null
    && EN_E07_MANYFOLD_USURPER_GATE.publishedApprovalRecord === null
    && EN_E07_MANYFOLD_USURPER_GATE.initialPublishedHandoff === null
    && EN_E07_MANYFOLD_USURPER_GATE.publicationState === 'approved-local',
  'Manyfold Usurper approved-local publication state drifted',
);
check(
  EN_E07_MANYFOLD_USURPER_GATE.approvalEvidence.includes('designer replied: approved lets do next')
    && EN_E07_MANYFOLD_USURPER_GATE.approvalEvidence.includes('responsive Aseprite 1.3.17.2 process 39276')
    && EN_E07_MANYFOLD_USURPER_GATE.approvalEvidence.includes('f3ed9a91cb01746fc7467e59c92335778a85b476495f5772ac81cf2a6cbda246')
    && EN_E07_MANYFOLD_USURPER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve'),
  'approval evidence or bounded publication authorization drifted',
);
check(
  EN_E07_MANYFOLD_USURPER_GATE.baseCheckpoint === 'fdbb4cf04048a819b9cbe1655146842835b86a73'
    && EN_E07_MANYFOLD_USURPER_GATE.authorizationEvidence.includes('designer replied: approved lets do next')
    && EN_E07_MANYFOLD_USURPER_GATE.authorizationEvidence.includes('only one private elite Changeling Manyfold Usurper'),
  'authorization evidence or bounded interpretation drifted',
);
check(
  EN_E07_MANYFOLD_USURPER_GATE.precedingApproval.gateId === EN_E07_MIRRORFOLD_HARRIER_GATE.id
    && EN_E07_MANYFOLD_USURPER_GATE.precedingApproval.candidateFrameDigest === EN_E07_MIRRORFOLD_HARRIER_GATE.candidateFrameDigest
    && EN_E07_MANYFOLD_USURPER_GATE.precedingApproval.publishedImplementation === EN_E07_MIRRORFOLD_HARRIER_GATE.publishedImplementation
    && EN_E07_MANYFOLD_USURPER_GATE.precedingApproval.publishedApprovalRecord === EN_E07_MIRRORFOLD_HARRIER_GATE.publishedApprovalRecord
    && EN_E07_MANYFOLD_USURPER_GATE.precedingApproval.initialPublishedHandoff === EN_E07_MIRRORFOLD_HARRIER_GATE.initialPublishedHandoff
    && EN_E07_MANYFOLD_USURPER_GATE.precedingApproval.currentReconciliation === 'fdbb4cf04048a819b9cbe1655146842835b86a73',
  'approved Mirrorfold Harrier predecessor drifted',
);
check(
  EN_E07_MANYFOLD_USURPER_GATE.scope.includes('complete 80-frame Manyfold Usurper elite Changeling')
    && EN_E07_MANYFOLD_USURPER_GATE.animationContract.includes('unfurls both heavy ordinary forearms into a wide decree')
    && EN_E07_MANYFOLD_USURPER_GATE.animationContract.includes('centered press')
    && EN_E07_MANYFOLD_USURPER_GATE.animationContract.includes('Cast aliases Attack exactly'),
  'full-suite or motion contract drifted',
);
check(
  EN_E07_MANYFOLD_USURPER_GATE.exclusions.includes('runtime actor copying')
    && EN_E07_MANYFOLD_USURPER_GATE.exclusions.includes('adult Doppelganger silhouette')
    && EN_E07_MANYFOLD_USURPER_GATE.exclusions.includes('detached masks')
    && EN_E07_MANYFOLD_USURPER_GATE.exclusions.includes('public Changeling registration')
    && EN_E07_MANYFOLD_USURPER_GATE.exclusions.includes('diamond-shaped Mirrorfold Harrier chassis')
    && EN_E07_MANYFOLD_USURPER_GATE.exclusions.includes('EN-E08 and later work'),
  'scope exclusions drifted',
);
check(
  EN_E07_MANYFOLD_USURPER_GATE.nextGate.includes('visually approved')
    && EN_E07_MANYFOLD_USURPER_GATE.nextGate.includes('one private common Kelpie candidate')
    && EN_E07_MANYFOLD_USURPER_GATE.nextGate.includes('Changeling registration')
    && EN_E07_MANYFOLD_USURPER_GATE.nextGate.includes('remain closed'),
  'approved-local publication or next-family stop gate drifted',
);
check(
  JSON.stringify(EN_E07_MANYFOLD_USURPER_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E07_MANYFOLD_USURPER_CONTRACT_CARD.precedingVariant.id === 'mirrorfold-harrier'
    && EN_E07_MANYFOLD_USURPER_CONTRACT_CARD.activeVariant.id === 'manyfold-usurper'
    && EN_E07_MANYFOLD_USURPER_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E07_MANYFOLD_USURPER_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E07_MANYFOLD_USURPER_CONTRACT_CARD.deferredRoles) === JSON.stringify([])
    && EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.activeVariant.id === 'mirrorfold-harrier'
    && EN_E07_CHANGELING_CONTRACT_CARD.activeVariant.id === 'veilskin-foundling',
  'Changeling role order or elite-only boundary drifted',
);
check(
  EN_E07_MANYFOLD_USURPER_CONTRACT.silhouette.includes('connected three-tier fan mantle')
    && EN_E07_MANYFOLD_USURPER_CONTRACT.silhouette.includes('two paired heavy ordinary arms')
    && EN_E07_MANYFOLD_USURPER_CONTRACT.silhouette.includes('broader and heavier than Mirrorfold Harrier')
    && EN_E07_MANYFOLD_USURPER_CONTRACT.identity.includes('dark eye sockets with amber glints')
    && EN_E07_MANYFOLD_USURPER_CONTRACT.identity.includes('without promising runtime actor copying')
    && EN_E07_MANYFOLD_USURPER_DATA.bakedEffects.length === 0,
  'Manyfold authored-elite identity or effect firewall drifted',
);
check(
  Object.isFrozen(EN_E07_MANYFOLD_USURPER_GATE)
    && Object.isFrozen(EN_E07_MANYFOLD_USURPER_DATA)
    && Object.isFrozen(EN_E07_MANYFOLD_USURPER_CONTRACT)
    && Object.isFrozen(EN_E07_MANYFOLD_USURPER_CONTRACT_CARD),
  'gate, data, and contracts must be deeply immutable',
);
check(
  EN_E07_MANYFOLD_USURPER_REGISTRY.families.length === 1
    && EN_E07_MANYFOLD_USURPER_REGISTRY.publicFamilies.length === 0
    && EN_E07_MANYFOLD_USURPER_FAMILY.variants.length === 1,
  'candidate registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'changeling'),
  'candidate must preserve public 80/259 and keep Changeling private',
);
check(engine.EN_E07_MANYFOLD_USURPER_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('changeling'), 'public expansion registry must not mention Changeling');
check(!manifestSource.includes('changeling'), 'asset manifest must not mention Changeling');

const captures = new Map();
const candidateRecords = [];
const mirrorfoldRecords = [];
const veilskinRecords = [];
const grandPretenderRecords = [];
const palettes = [
  ['skin', new Set(EN_E07_MANYFOLD_USURPER_DATA.manyfoldUsurper.skin)],
  ['veil', new Set(EN_E07_MANYFOLD_USURPER_DATA.manyfoldUsurper.veil)],
  ['fold', new Set(EN_E07_MANYFOLD_USURPER_DATA.manyfoldUsurper.fold)],
  ['accent', new Set(EN_E07_MANYFOLD_USURPER_DATA.manyfoldUsurper.accent)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let colored = 0;
let flashes = 0;
let eyeViews = 0;
let readableFaceViews = 0;
let threeTierFanFrames = 0;
let widePillarLegRows = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let mirrorfoldDifferences = 0;
let mirrorfoldAlphaDifferences = 0;
let veilskinDifferences = 0;
let veilskinAlphaDifferences = 0;
let grandPretenderDifferences = 0;
let grandPretenderAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E07_MANYFOLD_USURPER_REGISTRY, candidateSpec, direction, animation.id, frame);
    const mirrorfold = captureEnemyExpansionFrame(EN_E07_MIRRORFOLD_HARRIER_REGISTRY, mirrorfoldSpec, direction, animation.id, frame);
    const veilskin = captureEnemyExpansionFrame(EN_E07_VEILSKIN_FOUNDLING_REGISTRY, veilskinSpec, direction, animation.id, frame);
    const grandPretender = captureEnemyExpansionFrame(EN_E07_GRAND_PRETENDER_REGISTRY, grandPretenderSpec, direction, animation.id, frame);
    captures.set(key, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    mirrorfoldRecords.push(frameRecord(mirrorfold, mirrorfoldSpec, direction, animation.id, frame));
    veilskinRecords.push(frameRecord(veilskin, veilskinSpec, direction, animation.id, frame));
    grandPretenderRecords.push(frameRecord(grandPretender, grandPretenderSpec, direction, animation.id, frame));

    check(candidate.outOfBoundsWrites.length === 0, key + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), key + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++;
    else check(false, key + ' must remain one connected actor');
    const isBounded = candidate.bounds
      && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1
      && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++;
    else check(false, key + ' lost the one-cell margin');
    const isGrounded = candidate.bounds && candidate.bounds.maxY >= 21 && candidate.bounds.maxY <= 22;
    if (isGrounded) grounded++;
    else check(false, key + ' lost slab-foot ground contact');
    check(candidate.opaquePixels >= 200 && candidate.opaquePixels <= 400, key + ' density is implausible for the broad three-tier elite');
    if (widestUpperRow(candidate.pixels) >= 19) threeTierFanFrames++;
    else check(false, key + ' lost the broad three-tier fan span');
    if (rowOpaqueBetween(candidate.pixels, 20, 4, 20) >= 6) widePillarLegRows++;
    else check(false, key + ' lost the wide paired pillar-leg row');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (candidate.digest !== mirrorfold.digest) mirrorfoldDifferences++;
    if (candidate.alphaDigest !== mirrorfold.alphaDigest) mirrorfoldAlphaDifferences++;
    if (candidate.digest !== veilskin.digest) veilskinDifferences++;
    if (candidate.alphaDigest !== veilskin.alphaDigest) veilskinAlphaDifferences++;
    if (candidate.digest !== grandPretender.digest) grandPretenderDifferences++;
    if (candidate.alphaDigest !== grandPretender.alphaDigest) grandPretenderAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), key + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, key + ' lost ' + name + ' palette identity');
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_MANYFOLD_USURPER_DATA.manyfoldUsurper.eye]));
      const featureCount = countColors(candidate.pixels, new Set([EN_E07_MANYFOLD_USURPER_DATA.manyfoldUsurper.feature]));
      if (direction === 'up') {
        check(eyeCount === 0, key + ' rear view must not expose eye pixels');
        check(featureCount === 0, key + ' rear view must not expose face-feature pixels');
      }
      else if (direction === 'down') {
        check(eyeCount === 2, key + ' front view must preserve one centered eye pair');
        check(featureCount === 4, key + ' front view must preserve two dark sockets and a two-pixel mouth');
        eyeViews++;
        readableFaceViews++;
      } else {
        check(eyeCount === 1, key + ' side view must preserve one profile eye');
        check(featureCount === 2, key + ' side view must preserve one dark socket and one mouth pixel');
        eyeViews++;
        readableFaceViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.manyfoldUsurperGate === EN_E07_MANYFOLD_USURPER_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_MIRRORFOLD_HARRIER_GATE.id,
      key + ' gate metadata drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E07_MANYFOLD_USURPER_DATA);
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
    check(cast.digest === attack.digest, direction + ' Cast A' + (frame + 1) + ' must alias Attack exactly');
    const death = captures.get(direction + '/death/' + frame);
    const hurt = captures.get(direction + '/hurt/' + EN_E07_MANYFOLD_USURPER_DEATH_SOURCE_FRAMES[frame]);
    check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
  }
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const candidateDigest = hashJson(candidateRecords);
const mirrorfoldDigest = hashJson(mirrorfoldRecords);
const veilskinDigest = hashJson(veilskinRecords);
const grandPretenderDigest = hashJson(grandPretenderRecords);
if (EN_E07_MANYFOLD_USURPER_GATE.candidateFrameDigest) check(candidateDigest === EN_E07_MANYFOLD_USURPER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E07_MANYFOLD_USURPER_GATE.mirrorfoldHarrierComparisonDigest) check(mirrorfoldDigest === EN_E07_MANYFOLD_USURPER_GATE.mirrorfoldHarrierComparisonDigest, 'Mirrorfold Harrier comparison digest drifted');
if (EN_E07_MANYFOLD_USURPER_GATE.veilskinFoundlingComparisonDigest) check(veilskinDigest === EN_E07_MANYFOLD_USURPER_GATE.veilskinFoundlingComparisonDigest, 'Veilskin Foundling comparison digest drifted');
if (EN_E07_MANYFOLD_USURPER_GATE.grandPretenderComparisonDigest) check(grandPretenderDigest === EN_E07_MANYFOLD_USURPER_GATE.grandPretenderComparisonDigest, 'Grand Pretender comparison digest drifted');
check(mirrorfoldDigest === EN_E07_MIRRORFOLD_HARRIER_GATE.candidateFrameDigest, 'approved Mirrorfold Harrier pixels drifted');
check(veilskinDigest === EN_E07_VEILSKIN_FOUNDLING_GATE.candidateFrameDigest, 'approved Veilskin Foundling pixels drifted');
check(grandPretenderDigest === EN_E07_GRAND_PRETENDER_GATE.candidateFrameDigest, 'approved Grand Pretender pixels drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Manyfold Usurper frames must be connected, bounded, and grounded');
check(colored === 72 && flashes === 8 && eyeViews === 54 && readableFaceViews === 54, 'colored, flash, eye-view, or readable-face totals drifted');
check(threeTierFanFrames === 80 && widePillarLegRows === 80, 'all 80 frames must preserve the broad three-tier fan and wide paired pillar-leg silhouette');
check(mirrorfoldDifferences === 80 && mirrorfoldAlphaDifferences === 80, 'Manyfold Usurper must differ from Mirrorfold Harrier in all 80 pixel and alpha frames');
check(veilskinDifferences === 80 && veilskinAlphaDifferences === 80, 'Manyfold Usurper must differ from Veilskin Foundling in all 80 pixel and alpha frames');
check(grandPretenderDifferences === 80 && grandPretenderAlphaDifferences === 80, 'Manyfold Usurper must differ from Grand Pretender in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E07_MANYFOLD_USURPER_GATE.artifactSha256) check(await fileHash(EN_E07_MANYFOLD_USURPER_GATE.artifact) === EN_E07_MANYFOLD_USURPER_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E07_MANYFOLD_USURPER_GATE.assembledArtifactSha256) check(await fileHash(EN_E07_MANYFOLD_USURPER_GATE.assembledArtifact) === EN_E07_MANYFOLD_USURPER_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E07_MANYFOLD_USURPER_GATE.comparisonArtifactSha256) check(await fileHash(EN_E07_MANYFOLD_USURPER_GATE.comparisonArtifact) === EN_E07_MANYFOLD_USURPER_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E07_MANYFOLD_USURPER_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E07_MANYFOLD_USURPER_GATE.reviewAnimations.raw.artifact) === EN_E07_MANYFOLD_USURPER_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E07_MANYFOLD_USURPER_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E07_MANYFOLD_USURPER_GATE.reviewAnimations.completeBForm.artifact) === EN_E07_MANYFOLD_USURPER_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E07_MANYFOLD_USURPER_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E07_MANYFOLD_USURPER_REGISTRY, { ...candidateSpec, family: 'doppelganger' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E07_MANYFOLD_USURPER_REGISTRY, { ...candidateSpec, variant: 'copied-player' }, 'down', 'idle', 0), 'runtime copied actor');

if (errors.length) {
  console.error('EN-E07 Changeling Manyfold Usurper focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E07 Changeling Manyfold Usurper focused gate passed.');
  console.log('- Mirrorfold Harrier distinction: ' + mirrorfoldDifferences + '/80 pixel frames and ' + mirrorfoldAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Veilskin Foundling distinction: ' + veilskinDifferences + '/80 pixel frames and ' + veilskinAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Grand Pretender distinction: ' + grandPretenderDifferences + '/80 pixel frames and ' + grandPretenderAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + threeTierFanFrames + '/80 broad three-tier fan spans; ' + widePillarLegRows + '/80 wide paired pillar-leg rows; ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + eyeViews + '/54 expected eye-bearing views; ' + readableFaceViews + '/54 readable face-feature views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: approved Mirrorfold Harrier, Veilskin Foundling, and Grand Pretender exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Approved Mirrorfold Harrier frame digest: ' + mirrorfoldDigest);
  console.log('- Approved Veilskin Foundling frame digest: ' + veilskinDigest);
  console.log('- Approved Grand Pretender frame digest: ' + grandPretenderDigest);
}
