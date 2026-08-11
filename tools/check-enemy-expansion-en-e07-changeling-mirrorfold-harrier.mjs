import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E07_PALE_ECHO_GATE,
  EN_E07_PALE_ECHO_REGISTRY,
} from '../engine/enemy-expansion-en-e07-doppelganger-pale-echo.js';
import {
  EN_E07_FALSEFACE_ADEPT_GATE,
  EN_E07_FALSEFACE_ADEPT_REGISTRY,
} from '../engine/enemy-expansion-en-e07-doppelganger-falseface-adept.js';
import {
  EN_E07_CHANGELING_CONTRACT_CARD,
  EN_E07_VEILSKIN_FOUNDLING_GATE,
  EN_E07_VEILSKIN_FOUNDLING_REGISTRY,
} from '../engine/enemy-expansion-en-e07-changeling-veilskin-foundling.js';
import {
  EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD,
  EN_E07_MIRRORFOLD_HARRIER_CONTRACT,
  EN_E07_MIRRORFOLD_HARRIER_DATA,
  EN_E07_MIRRORFOLD_HARRIER_DEATH_SOURCE_FRAMES,
  EN_E07_MIRRORFOLD_HARRIER_FAMILY,
  EN_E07_MIRRORFOLD_HARRIER_GATE,
  EN_E07_MIRRORFOLD_HARRIER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-changeling-mirrorfold-harrier.js';
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
const candidateSpec = { kind: 'enemy', family: 'changeling', variant: 'mirrorfold-harrier' };
const veilskinSpec = { kind: 'enemy', family: 'changeling', variant: 'veilskin-foundling' };
const paleEchoSpec = { kind: 'enemy', family: 'doppelganger', variant: 'pale-echo' };
const falsefaceSpec = { kind: 'enemy', family: 'doppelganger', variant: 'falseface-adept' };

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
  EN_E07_MIRRORFOLD_HARRIER_GATE.status === 'approved'
    && EN_E07_MIRRORFOLD_HARRIER_GATE.approvedOn === '2026-08-11'
    && EN_E07_MIRRORFOLD_HARRIER_GATE.approvedImplementation === 'ab72a9c0600f016439a5351f363b3b34348dc4b1'
    && EN_E07_MIRRORFOLD_HARRIER_GATE.publishedImplementation === 'ab72a9c0600f016439a5351f363b3b34348dc4b1'
    && EN_E07_MIRRORFOLD_HARRIER_GATE.publishedApprovalRecord === 'e976ca5fc5c249af4e727fb3bff7d58fd541a932'
    && EN_E07_MIRRORFOLD_HARRIER_GATE.initialPublishedHandoff === '4ed366a39165660096306cbb327315b211639e3d'
    && EN_E07_MIRRORFOLD_HARRIER_GATE.publicationState === 'published',
  'Mirrorfold Harrier published state drifted',
);
check(
  EN_E07_MIRRORFOLD_HARRIER_GATE.approvalEvidence.includes('designer replied: approved lets do next')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.approvalEvidence.includes('responsive Aseprite 1.3.17.2 process 40804')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.approvalEvidence.includes('be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve'),
  'approval evidence or bounded publication authorization drifted',
);
check(
  EN_E07_MIRRORFOLD_HARRIER_GATE.baseCheckpoint === '5eabfecc08f992db675b64ea3317eb59f67d737c'
    && EN_E07_MIRRORFOLD_HARRIER_GATE.authorizationEvidence.includes('designer replied: lets do next')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.authorizationEvidence.includes('only one private specialist Changeling Mirrorfold Harrier'),
  'authorization evidence or bounded interpretation drifted',
);
check(
  EN_E07_MIRRORFOLD_HARRIER_GATE.precedingApproval.gateId === EN_E07_VEILSKIN_FOUNDLING_GATE.id
    && EN_E07_MIRRORFOLD_HARRIER_GATE.precedingApproval.candidateFrameDigest === EN_E07_VEILSKIN_FOUNDLING_GATE.candidateFrameDigest
    && EN_E07_MIRRORFOLD_HARRIER_GATE.precedingApproval.publishedImplementation === EN_E07_VEILSKIN_FOUNDLING_GATE.publishedImplementation
    && EN_E07_MIRRORFOLD_HARRIER_GATE.precedingApproval.publishedApprovalRecord === EN_E07_VEILSKIN_FOUNDLING_GATE.publishedApprovalRecord
    && EN_E07_MIRRORFOLD_HARRIER_GATE.precedingApproval.initialPublishedHandoff === EN_E07_VEILSKIN_FOUNDLING_GATE.initialPublishedHandoff
    && EN_E07_MIRRORFOLD_HARRIER_GATE.precedingApproval.currentReconciliation === '5eabfecc08f992db675b64ea3317eb59f67d737c',
  'approved Veilskin Foundling predecessor drifted',
);
check(
  EN_E07_MIRRORFOLD_HARRIER_GATE.scope.includes('complete 80-frame Mirrorfold Harrier specialist Changeling')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.animationContract.includes('opens the paired long forearms into an angular feint')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.animationContract.includes('Cast aliases Attack exactly'),
  'full-suite or motion contract drifted',
);
check(
  EN_E07_MIRRORFOLD_HARRIER_GATE.exclusions.includes('runtime actor copying')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.exclusions.includes('adult Doppelganger silhouette')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.exclusions.includes('detached masks')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.exclusions.includes('public Changeling registration')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.exclusions.includes('Changeling elite')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.exclusions.includes('EN-E08 and later work'),
  'scope exclusions drifted',
);
check(
  EN_E07_MIRRORFOLD_HARRIER_GATE.nextGate.includes('visually approved and published')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.nextGate.includes('implementation ab72a9c0600f016439a5351f363b3b34348dc4b1')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.nextGate.includes('approval record e976ca5fc5c249af4e727fb3bff7d58fd541a932')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.nextGate.includes('initial handoff 4ed366a39165660096306cbb327315b211639e3d')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.nextGate.includes('remote verified')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.nextGate.includes('one private elite Changeling candidate')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.nextGate.includes('Kelpie')
    && EN_E07_MIRRORFOLD_HARRIER_GATE.nextGate.includes('remain closed'),
  'published tuple or next-role stop gate drifted',
);
check(
  JSON.stringify(EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.precedingVariant.id === 'veilskin-foundling'
    && EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.activeVariant.id === 'mirrorfold-harrier'
    && EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.deferredRoles) === JSON.stringify(['elite'])
    && EN_E07_CHANGELING_CONTRACT_CARD.activeVariant.id === 'veilskin-foundling',
  'Changeling role order or specialist-only boundary drifted',
);
check(
  EN_E07_MIRRORFOLD_HARRIER_CONTRACT.silhouette.includes('connected diamond-fold living mantle')
    && EN_E07_MIRRORFOLD_HARRIER_CONTRACT.silhouette.includes('two paired long ordinary forearms')
    && EN_E07_MIRRORFOLD_HARRIER_CONTRACT.silhouette.includes('taller and narrower than Veilskin Foundling')
    && EN_E07_MIRRORFOLD_HARRIER_CONTRACT.identity.includes('dark eye sockets with amber glints')
    && EN_E07_MIRRORFOLD_HARRIER_CONTRACT.identity.includes('without promising runtime actor copying')
    && EN_E07_MIRRORFOLD_HARRIER_DATA.bakedEffects.length === 0,
  'Mirrorfold authored-specialist identity or effect firewall drifted',
);
check(
  Object.isFrozen(EN_E07_MIRRORFOLD_HARRIER_GATE)
    && Object.isFrozen(EN_E07_MIRRORFOLD_HARRIER_DATA)
    && Object.isFrozen(EN_E07_MIRRORFOLD_HARRIER_CONTRACT)
    && Object.isFrozen(EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD),
  'gate, data, and contracts must be deeply immutable',
);
check(
  EN_E07_MIRRORFOLD_HARRIER_REGISTRY.families.length === 1
    && EN_E07_MIRRORFOLD_HARRIER_REGISTRY.publicFamilies.length === 0
    && EN_E07_MIRRORFOLD_HARRIER_FAMILY.variants.length === 1,
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
check(engine.EN_E07_MIRRORFOLD_HARRIER_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('changeling'), 'public expansion registry must not mention Changeling');
check(!manifestSource.includes('changeling'), 'asset manifest must not mention Changeling');

const captures = new Map();
const candidateRecords = [];
const veilskinRecords = [];
const paleEchoRecords = [];
const falsefaceRecords = [];
const palettes = [
  ['skin', new Set(EN_E07_MIRRORFOLD_HARRIER_DATA.mirrorfoldHarrier.skin)],
  ['veil', new Set(EN_E07_MIRRORFOLD_HARRIER_DATA.mirrorfoldHarrier.veil)],
  ['fold', new Set(EN_E07_MIRRORFOLD_HARRIER_DATA.mirrorfoldHarrier.fold)],
  ['accent', new Set(EN_E07_MIRRORFOLD_HARRIER_DATA.mirrorfoldHarrier.accent)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let colored = 0;
let flashes = 0;
let eyeViews = 0;
let readableFaceViews = 0;
let diamondShoulderFrames = 0;
let narrowLegRows = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let veilskinDifferences = 0;
let veilskinAlphaDifferences = 0;
let paleEchoDifferences = 0;
let paleEchoAlphaDifferences = 0;
let falsefaceDifferences = 0;
let falsefaceAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E07_MIRRORFOLD_HARRIER_REGISTRY, candidateSpec, direction, animation.id, frame);
    const veilskin = captureEnemyExpansionFrame(EN_E07_VEILSKIN_FOUNDLING_REGISTRY, veilskinSpec, direction, animation.id, frame);
    const paleEcho = captureEnemyExpansionFrame(EN_E07_PALE_ECHO_REGISTRY, paleEchoSpec, direction, animation.id, frame);
    const falseface = captureEnemyExpansionFrame(EN_E07_FALSEFACE_ADEPT_REGISTRY, falsefaceSpec, direction, animation.id, frame);
    captures.set(key, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    veilskinRecords.push(frameRecord(veilskin, veilskinSpec, direction, animation.id, frame));
    paleEchoRecords.push(frameRecord(paleEcho, paleEchoSpec, direction, animation.id, frame));
    falsefaceRecords.push(frameRecord(falseface, falsefaceSpec, direction, animation.id, frame));

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
    else check(false, key + ' lost wedge-foot ground contact');
    check(candidate.opaquePixels >= 150 && candidate.opaquePixels <= 300, key + ' density is implausible for the compact diamond-mantle specialist');
    if (widestUpperRow(candidate.pixels) >= 18) diamondShoulderFrames++;
    else check(false, key + ' lost the broad stepped diamond shoulder span');
    if (rowOpaqueBetween(candidate.pixels, 20, 8, 15) === 4) narrowLegRows++;
    else check(false, key + ' lost the narrow paired lower-leg row');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (candidate.digest !== veilskin.digest) veilskinDifferences++;
    if (candidate.alphaDigest !== veilskin.alphaDigest) veilskinAlphaDifferences++;
    if (candidate.digest !== paleEcho.digest) paleEchoDifferences++;
    if (candidate.alphaDigest !== paleEcho.alphaDigest) paleEchoAlphaDifferences++;
    if (candidate.digest !== falseface.digest) falsefaceDifferences++;
    if (candidate.alphaDigest !== falseface.alphaDigest) falsefaceAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), key + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, key + ' lost ' + name + ' palette identity');
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_MIRRORFOLD_HARRIER_DATA.mirrorfoldHarrier.eye]));
      const featureCount = countColors(candidate.pixels, new Set([EN_E07_MIRRORFOLD_HARRIER_DATA.mirrorfoldHarrier.feature]));
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
      candidate.renderResult.mirrorfoldHarrierGate === EN_E07_MIRRORFOLD_HARRIER_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_VEILSKIN_FOUNDLING_GATE.id,
      key + ' gate metadata drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E07_MIRRORFOLD_HARRIER_DATA);
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
    const hurt = captures.get(direction + '/hurt/' + EN_E07_MIRRORFOLD_HARRIER_DEATH_SOURCE_FRAMES[frame]);
    check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
  }
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const candidateDigest = hashJson(candidateRecords);
const veilskinDigest = hashJson(veilskinRecords);
const paleEchoDigest = hashJson(paleEchoRecords);
const falsefaceDigest = hashJson(falsefaceRecords);
if (EN_E07_MIRRORFOLD_HARRIER_GATE.candidateFrameDigest) check(candidateDigest === EN_E07_MIRRORFOLD_HARRIER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E07_MIRRORFOLD_HARRIER_GATE.veilskinFoundlingComparisonDigest) check(veilskinDigest === EN_E07_MIRRORFOLD_HARRIER_GATE.veilskinFoundlingComparisonDigest, 'Veilskin Foundling comparison digest drifted');
if (EN_E07_MIRRORFOLD_HARRIER_GATE.paleEchoComparisonDigest) check(paleEchoDigest === EN_E07_MIRRORFOLD_HARRIER_GATE.paleEchoComparisonDigest, 'Pale Echo comparison digest drifted');
if (EN_E07_MIRRORFOLD_HARRIER_GATE.falsefaceAdeptComparisonDigest) check(falsefaceDigest === EN_E07_MIRRORFOLD_HARRIER_GATE.falsefaceAdeptComparisonDigest, 'Falseface Adept comparison digest drifted');
check(veilskinDigest === EN_E07_VEILSKIN_FOUNDLING_GATE.candidateFrameDigest, 'approved Veilskin Foundling pixels drifted');
check(paleEchoDigest === EN_E07_PALE_ECHO_GATE.candidateFrameDigest, 'approved Pale Echo pixels drifted');
check(falsefaceDigest === EN_E07_FALSEFACE_ADEPT_GATE.candidateFrameDigest, 'approved Falseface Adept pixels drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Mirrorfold Harrier frames must be connected, bounded, and grounded');
check(colored === 72 && flashes === 8 && eyeViews === 54 && readableFaceViews === 54, 'colored, flash, eye-view, or readable-face totals drifted');
check(diamondShoulderFrames === 80 && narrowLegRows === 80, 'all 80 frames must preserve the stepped diamond shoulder and narrow paired-leg silhouette');
check(veilskinDifferences === 80 && veilskinAlphaDifferences === 80, 'Mirrorfold Harrier must differ from Veilskin Foundling in all 80 pixel and alpha frames');
check(paleEchoDifferences === 80 && paleEchoAlphaDifferences === 80, 'Mirrorfold Harrier must differ from Pale Echo in all 80 pixel and alpha frames');
check(falsefaceDifferences === 80 && falsefaceAlphaDifferences === 80, 'Mirrorfold Harrier must differ from Falseface Adept in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E07_MIRRORFOLD_HARRIER_GATE.artifactSha256) check(await fileHash(EN_E07_MIRRORFOLD_HARRIER_GATE.artifact) === EN_E07_MIRRORFOLD_HARRIER_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E07_MIRRORFOLD_HARRIER_GATE.assembledArtifactSha256) check(await fileHash(EN_E07_MIRRORFOLD_HARRIER_GATE.assembledArtifact) === EN_E07_MIRRORFOLD_HARRIER_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E07_MIRRORFOLD_HARRIER_GATE.comparisonArtifactSha256) check(await fileHash(EN_E07_MIRRORFOLD_HARRIER_GATE.comparisonArtifact) === EN_E07_MIRRORFOLD_HARRIER_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E07_MIRRORFOLD_HARRIER_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E07_MIRRORFOLD_HARRIER_GATE.reviewAnimations.raw.artifact) === EN_E07_MIRRORFOLD_HARRIER_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E07_MIRRORFOLD_HARRIER_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E07_MIRRORFOLD_HARRIER_GATE.reviewAnimations.completeBForm.artifact) === EN_E07_MIRRORFOLD_HARRIER_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E07_MIRRORFOLD_HARRIER_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E07_MIRRORFOLD_HARRIER_REGISTRY, { ...candidateSpec, family: 'doppelganger' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E07_MIRRORFOLD_HARRIER_REGISTRY, { ...candidateSpec, variant: 'copied-player' }, 'down', 'idle', 0), 'runtime copied actor');

if (errors.length) {
  console.error('EN-E07 Changeling Mirrorfold Harrier focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E07 Changeling Mirrorfold Harrier focused gate passed.');
  console.log('- Veilskin Foundling distinction: ' + veilskinDifferences + '/80 pixel frames and ' + veilskinAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Pale Echo distinction: ' + paleEchoDifferences + '/80 pixel frames and ' + paleEchoAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Falseface Adept distinction: ' + falsefaceDifferences + '/80 pixel frames and ' + falsefaceAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + diamondShoulderFrames + '/80 diamond shoulder spans; ' + narrowLegRows + '/80 narrow paired-leg rows; ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + eyeViews + '/54 expected eye-bearing views; ' + readableFaceViews + '/54 readable face-feature views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: approved Veilskin Foundling, Pale Echo, and Falseface Adept exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Approved Veilskin Foundling frame digest: ' + veilskinDigest);
  console.log('- Approved Pale Echo frame digest: ' + paleEchoDigest);
  console.log('- Approved Falseface Adept frame digest: ' + falsefaceDigest);
}
