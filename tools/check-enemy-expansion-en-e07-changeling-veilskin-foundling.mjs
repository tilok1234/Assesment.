import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E07_PALE_ECHO_GATE,
  EN_E07_PALE_ECHO_REGISTRY,
} from '../engine/enemy-expansion-en-e07-doppelganger-pale-echo.js';
import {
  EN_E07_MIRECROWN_BEACON_GATE,
  EN_E07_MIRECROWN_BEACON_REGISTRY,
} from '../engine/enemy-expansion-en-e07-will-o-wisp-mirecrown-beacon.js';
import {
  EN_E07_CHANGELING_CONTRACT_CARD,
  EN_E07_VEILSKIN_FOUNDLING_CONTRACT,
  EN_E07_VEILSKIN_FOUNDLING_DATA,
  EN_E07_VEILSKIN_FOUNDLING_DEATH_SOURCE_FRAMES,
  EN_E07_VEILSKIN_FOUNDLING_FAMILY,
  EN_E07_VEILSKIN_FOUNDLING_GATE,
  EN_E07_VEILSKIN_FOUNDLING_REGISTRY,
} from '../engine/enemy-expansion-en-e07-changeling-veilskin-foundling.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
  mirrorPixels,
  pixelDigest,
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
const candidateSpec = { kind: 'enemy', family: 'changeling', variant: 'veilskin-foundling' };
const paleEchoSpec = { kind: 'enemy', family: 'doppelganger', variant: 'pale-echo' };
const goblinSpec = { kind: 'enemy', family: 'goblin', variant: 'scout' };
const impSpec = { kind: 'enemy', family: 'imp', variant: 'sprite' };
const mirecrownSpec = { kind: 'enemy', family: 'will-o-wisp', variant: 'mirecrown-beacon' };

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

function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(24 * 24).fill(null);
  const outOfBoundsWrites = [];
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py });
        else pixels[(py * 24) + px] = null;
      }
    },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py });
        else pixels[(py * 24) + px] = fillStyle;
      }
    },
  };
  drawLegacySprite(context, spec, direction, animation, frame, { shadow: false });
  const occupied = pixels.flatMap((color, index) => color === null ? [] : [{ x: index % 24, y: Math.floor(index / 24) }]);
  const bounds = occupied.length ? {
    minX: Math.min(...occupied.map(({ x }) => x)),
    minY: Math.min(...occupied.map(({ y }) => y)),
    maxX: Math.max(...occupied.map(({ x }) => x)),
    maxY: Math.max(...occupied.map(({ y }) => y)),
  } : null;
  return Object.freeze({
    pixels: Object.freeze(pixels),
    alpha: Uint8Array.from(pixels, (color) => color === null ? 0 : 255),
    opaquePixels: occupied.length,
    bounds: bounds && Object.freeze(bounds),
    outOfBoundsWrites: Object.freeze(outOfBoundsWrites),
    digest: pixelDigest(pixels),
    alphaDigest: alphaDigest(pixels),
  });
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
  EN_E07_VEILSKIN_FOUNDLING_GATE.status === 'implemented-awaiting-review'
    && EN_E07_VEILSKIN_FOUNDLING_GATE.approvedOn === null
    && EN_E07_VEILSKIN_FOUNDLING_GATE.approvedImplementation === null
    && EN_E07_VEILSKIN_FOUNDLING_GATE.publishedImplementation === null
    && EN_E07_VEILSKIN_FOUNDLING_GATE.publishedApprovalRecord === null
    && EN_E07_VEILSKIN_FOUNDLING_GATE.publicationState === 'not-published',
  'Veilskin Foundling must remain implemented, unapproved, and unpublished',
);
check(
  EN_E07_VEILSKIN_FOUNDLING_GATE.baseCheckpoint === '4ee32622ec2984ac805ac345b854f23584fda3c3'
    && EN_E07_VEILSKIN_FOUNDLING_GATE.authorizationEvidence.includes('designer replied: approved lets do next')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.authorizationEvidence.includes('only one private common Changeling Veilskin Foundling')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.repairRequestEvidence.includes('could need a more readable face')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.repairRequestEvidence.includes('dark eye sockets')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.supersededCandidateFrameDigest === '1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d',
  'authorization evidence or bounded interpretation drifted',
);
check(
  EN_E07_VEILSKIN_FOUNDLING_GATE.precedingApproval.gateId === EN_E07_MIRECROWN_BEACON_GATE.id
    && EN_E07_VEILSKIN_FOUNDLING_GATE.precedingApproval.candidateFrameDigest === EN_E07_MIRECROWN_BEACON_GATE.candidateFrameDigest
    && EN_E07_VEILSKIN_FOUNDLING_GATE.precedingApproval.publishedImplementation === EN_E07_MIRECROWN_BEACON_GATE.publishedImplementation
    && EN_E07_VEILSKIN_FOUNDLING_GATE.precedingApproval.publishedApprovalRecord === EN_E07_MIRECROWN_BEACON_GATE.publishedApprovalRecord
    && EN_E07_VEILSKIN_FOUNDLING_GATE.precedingApproval.currentReconciliation === '4ee32622ec2984ac805ac345b854f23584fda3c3',
  'approved Mirecrown predecessor drifted',
);
check(
  EN_E07_VEILSKIN_FOUNDLING_GATE.scope.includes('complete 80-frame Veilskin Foundling common Changeling')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.animationContract.includes('extends both short forearms symmetrically')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.animationContract.includes('Cast aliases Attack exactly'),
  'full-suite or motion contract drifted',
);
check(
  EN_E07_VEILSKIN_FOUNDLING_GATE.exclusions.includes('runtime actor copying')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.exclusions.includes('adult Doppelganger silhouette')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.exclusions.includes('detached masks')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.exclusions.includes('public Changeling registration')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.exclusions.includes('Changeling specialist or elite')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.exclusions.includes('EN-E08 and later work'),
  'scope exclusions drifted',
);
check(
  EN_E07_VEILSKIN_FOUNDLING_GATE.nextGate.includes('Visual approval is required')
    && EN_E07_VEILSKIN_FOUNDLING_GATE.nextGate.includes('Do not commit or push the candidate'),
  'visual-approval stop gate drifted',
);
check(
  JSON.stringify(EN_E07_CHANGELING_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E07_CHANGELING_CONTRACT_CARD.activeVariant.id === 'veilskin-foundling'
    && EN_E07_CHANGELING_CONTRACT_CARD.activeVariant.status === 'implemented-full-awaiting-review'
    && JSON.stringify(EN_E07_CHANGELING_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite']),
  'Changeling role order or common-only boundary drifted',
);
check(
  EN_E07_VEILSKIN_FOUNDLING_CONTRACT.silhouette.includes('connected pear-shaped living veil')
    && EN_E07_VEILSKIN_FOUNDLING_CONTRACT.silhouette.includes('two short paired ordinary arms')
    && EN_E07_VEILSKIN_FOUNDLING_CONTRACT.identity.includes('dark eye sockets with amber glints')
    && EN_E07_VEILSKIN_FOUNDLING_CONTRACT.identity.includes('without promising runtime actor copying')
    && EN_E07_VEILSKIN_FOUNDLING_DATA.bakedEffects.length === 0,
  'Veilskin authored-default identity or effect firewall drifted',
);
check(
  Object.isFrozen(EN_E07_VEILSKIN_FOUNDLING_GATE)
    && Object.isFrozen(EN_E07_VEILSKIN_FOUNDLING_DATA)
    && Object.isFrozen(EN_E07_VEILSKIN_FOUNDLING_CONTRACT)
    && Object.isFrozen(EN_E07_CHANGELING_CONTRACT_CARD),
  'gate, data, and contracts must be deeply immutable',
);
check(
  EN_E07_VEILSKIN_FOUNDLING_REGISTRY.families.length === 1
    && EN_E07_VEILSKIN_FOUNDLING_REGISTRY.publicFamilies.length === 0
    && EN_E07_VEILSKIN_FOUNDLING_FAMILY.variants.length === 1,
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
check(engine.EN_E07_VEILSKIN_FOUNDLING_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('changeling'), 'public expansion registry must not mention Changeling');
check(!manifestSource.includes('changeling'), 'asset manifest must not mention Changeling');

const captures = new Map();
const candidateRecords = [];
const paleEchoRecords = [];
const goblinRecords = [];
const impRecords = [];
const mirecrownRecords = [];
const palettes = [
  ['skin', new Set(EN_E07_VEILSKIN_FOUNDLING_DATA.veilskinFoundling.skin)],
  ['veil', new Set(EN_E07_VEILSKIN_FOUNDLING_DATA.veilskinFoundling.veil)],
  ['fold', new Set(EN_E07_VEILSKIN_FOUNDLING_DATA.veilskinFoundling.fold)],
  ['accent', new Set(EN_E07_VEILSKIN_FOUNDLING_DATA.veilskinFoundling.accent)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let colored = 0;
let flashes = 0;
let eyeViews = 0;
let readableFaceViews = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let paleEchoDifferences = 0;
let paleEchoAlphaDifferences = 0;
let goblinDifferences = 0;
let goblinAlphaDifferences = 0;
let impDifferences = 0;
let impAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E07_VEILSKIN_FOUNDLING_REGISTRY, candidateSpec, direction, animation.id, frame);
    const paleEcho = captureEnemyExpansionFrame(EN_E07_PALE_ECHO_REGISTRY, paleEchoSpec, direction, animation.id, frame);
    const goblin = captureLegacyFrame(goblinSpec, direction, animation.id, frame);
    const imp = captureLegacyFrame(impSpec, direction, animation.id, frame);
    const mirecrown = captureEnemyExpansionFrame(EN_E07_MIRECROWN_BEACON_REGISTRY, mirecrownSpec, direction, animation.id, frame);
    captures.set(key, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    paleEchoRecords.push(frameRecord(paleEcho, paleEchoSpec, direction, animation.id, frame));
    goblinRecords.push(frameRecord(goblin, goblinSpec, direction, animation.id, frame, false));
    impRecords.push(frameRecord(imp, impSpec, direction, animation.id, frame, false));
    mirecrownRecords.push(frameRecord(mirecrown, mirecrownSpec, direction, animation.id, frame));

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
    else check(false, key + ' lost splayed-foot ground contact');
    check(candidate.opaquePixels >= 190 && candidate.opaquePixels <= 285, key + ' density is implausible for the small pear-veil fey');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (candidate.digest !== paleEcho.digest) paleEchoDifferences++;
    if (candidate.alphaDigest !== paleEcho.alphaDigest) paleEchoAlphaDifferences++;
    if (candidate.digest !== goblin.digest) goblinDifferences++;
    if (candidate.alphaDigest !== goblin.alphaDigest) goblinAlphaDifferences++;
    if (candidate.digest !== imp.digest) impDifferences++;
    if (candidate.alphaDigest !== imp.alphaDigest) impAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), key + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, key + ' lost ' + name + ' palette identity');
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_VEILSKIN_FOUNDLING_DATA.veilskinFoundling.eye]));
      const featureCount = countColors(candidate.pixels, new Set([EN_E07_VEILSKIN_FOUNDLING_DATA.veilskinFoundling.feature]));
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
      candidate.renderResult.veilskinFoundlingGate === EN_E07_VEILSKIN_FOUNDLING_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_MIRECROWN_BEACON_GATE.id,
      key + ' gate metadata drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E07_VEILSKIN_FOUNDLING_DATA);
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
    const hurt = captures.get(direction + '/hurt/' + EN_E07_VEILSKIN_FOUNDLING_DEATH_SOURCE_FRAMES[frame]);
    check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
  }
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const candidateDigest = hashJson(candidateRecords);
const paleEchoDigest = hashJson(paleEchoRecords);
const goblinDigest = hashJson(goblinRecords);
const impDigest = hashJson(impRecords);
const mirecrownDigest = hashJson(mirecrownRecords);
if (EN_E07_VEILSKIN_FOUNDLING_GATE.candidateFrameDigest) check(candidateDigest === EN_E07_VEILSKIN_FOUNDLING_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E07_VEILSKIN_FOUNDLING_GATE.paleEchoComparisonDigest) check(paleEchoDigest === EN_E07_VEILSKIN_FOUNDLING_GATE.paleEchoComparisonDigest, 'Pale Echo comparison digest drifted');
if (EN_E07_VEILSKIN_FOUNDLING_GATE.goblinScoutComparisonDigest) check(goblinDigest === EN_E07_VEILSKIN_FOUNDLING_GATE.goblinScoutComparisonDigest, 'Goblin Scout comparison digest drifted');
if (EN_E07_VEILSKIN_FOUNDLING_GATE.impSpriteComparisonDigest) check(impDigest === EN_E07_VEILSKIN_FOUNDLING_GATE.impSpriteComparisonDigest, 'Imp Sprite comparison digest drifted');
check(paleEchoDigest === EN_E07_PALE_ECHO_GATE.candidateFrameDigest, 'approved Pale Echo pixels drifted');
check(mirecrownDigest === EN_E07_MIRECROWN_BEACON_GATE.candidateFrameDigest, 'approved Mirecrown predecessor pixels drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Veilskin Foundling frames must be connected, bounded, and grounded');
check(colored === 72 && flashes === 8 && eyeViews === 54 && readableFaceViews === 54, 'colored, flash, eye-view, or readable-face totals drifted');
check(paleEchoDifferences === 80 && paleEchoAlphaDifferences === 80, 'Veilskin Foundling must differ from Pale Echo in all 80 pixel and alpha frames');
check(goblinDifferences === 80 && goblinAlphaDifferences === 80, 'Veilskin Foundling must differ from Goblin Scout in all 80 pixel and alpha frames');
check(impDifferences === 80 && impAlphaDifferences === 80, 'Veilskin Foundling must differ from Imp Sprite in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E07_VEILSKIN_FOUNDLING_GATE.artifactSha256) check(await fileHash(EN_E07_VEILSKIN_FOUNDLING_GATE.artifact) === EN_E07_VEILSKIN_FOUNDLING_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E07_VEILSKIN_FOUNDLING_GATE.assembledArtifactSha256) check(await fileHash(EN_E07_VEILSKIN_FOUNDLING_GATE.assembledArtifact) === EN_E07_VEILSKIN_FOUNDLING_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E07_VEILSKIN_FOUNDLING_GATE.comparisonArtifactSha256) check(await fileHash(EN_E07_VEILSKIN_FOUNDLING_GATE.comparisonArtifact) === EN_E07_VEILSKIN_FOUNDLING_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E07_VEILSKIN_FOUNDLING_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E07_VEILSKIN_FOUNDLING_GATE.reviewAnimations.raw.artifact) === EN_E07_VEILSKIN_FOUNDLING_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E07_VEILSKIN_FOUNDLING_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E07_VEILSKIN_FOUNDLING_GATE.reviewAnimations.completeBForm.artifact) === EN_E07_VEILSKIN_FOUNDLING_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E07_VEILSKIN_FOUNDLING_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E07_VEILSKIN_FOUNDLING_REGISTRY, { ...candidateSpec, family: 'doppelganger' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E07_VEILSKIN_FOUNDLING_REGISTRY, { ...candidateSpec, variant: 'copied-player' }, 'down', 'idle', 0), 'runtime copied actor');

if (errors.length) {
  console.error('EN-E07 Changeling Veilskin Foundling focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E07 Changeling Veilskin Foundling focused gate passed.');
  console.log('- Pale Echo distinction: ' + paleEchoDifferences + '/80 pixel frames and ' + paleEchoAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Goblin Scout distinction: ' + goblinDifferences + '/80 pixel frames and ' + goblinAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Imp Sprite distinction: ' + impDifferences + '/80 pixel frames and ' + impAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + eyeViews + '/54 expected eye-bearing views; ' + readableFaceViews + '/54 readable face-feature views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: approved Mirecrown and Pale Echo exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Approved Pale Echo frame digest: ' + paleEchoDigest);
  console.log('- Public Goblin Scout frame digest: ' + goblinDigest);
  console.log('- Public Imp Sprite frame digest: ' + impDigest);
  console.log('- Approved Mirecrown Beacon frame digest: ' + mirecrownDigest);
}
