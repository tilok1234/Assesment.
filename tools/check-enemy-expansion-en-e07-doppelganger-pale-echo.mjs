import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E07_HOLLOWCROWN_REGENT_GATE,
  EN_E07_HOLLOWCROWN_REGENT_REGISTRY,
} from '../engine/enemy-expansion-en-e07-living-shadow-hollowcrown-regent.js';
import {
  EN_E07_DOPPELGANGER_CONTRACT_CARD,
  EN_E07_PALE_ECHO_CONTRACT,
  EN_E07_PALE_ECHO_DATA,
  EN_E07_PALE_ECHO_DEATH_SOURCE_FRAMES,
  EN_E07_PALE_ECHO_FAMILY,
  EN_E07_PALE_ECHO_GATE,
  EN_E07_PALE_ECHO_REGISTRY,
} from '../engine/enemy-expansion-en-e07-doppelganger-pale-echo.js';
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
const candidateSpec = { kind: 'enemy', family: 'doppelganger', variant: 'pale-echo' };
const banditSpec = { kind: 'enemy', family: 'bandit', variant: 'thug' };
const cultistSpec = { kind: 'enemy', family: 'cultist', variant: 'acolyte' };
const darkElfSpec = { kind: 'enemy', family: 'elf', variant: 'dark' };
const hollowcrownSpec = { kind: 'enemy', family: 'living-shadow', variant: 'hollowcrown-regent' };

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function frameRecord(captured, family, variant, direction, animation, frame, candidateFamily = true) {
  return {
    family,
    variant,
    ...(candidateFamily ? { candidateFamily: family } : {}),
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
  EN_E07_PALE_ECHO_GATE.status === 'approved'
    && EN_E07_PALE_ECHO_GATE.approvedOn === '2026-08-10'
    && EN_E07_PALE_ECHO_GATE.approvedImplementation === '0628135b84725836c552e13db797540a965854cb'
    && EN_E07_PALE_ECHO_GATE.publishedImplementation === '0628135b84725836c552e13db797540a965854cb'
    && EN_E07_PALE_ECHO_GATE.publishedApprovalRecord === '182938381ac39812434518d0216e6e9796367bbb'
    && EN_E07_PALE_ECHO_GATE.initialPublishedHandoff === '1e6e8d8bb01de97ca4e1373b62b461e40b1aa239'
    && EN_E07_PALE_ECHO_GATE.publicationState === 'published',
  'Pale Echo published state drifted',
);
check(
  EN_E07_PALE_ECHO_GATE.approvalEvidence.includes('three exact repaired PNG review boards were opened together in Aseprite')
    && EN_E07_PALE_ECHO_GATE.approvalEvidence.includes('designer replied: approved lets do next')
    && EN_E07_PALE_ECHO_GATE.approvalEvidence.includes('c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596')
    && EN_E07_PALE_ECHO_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve'),
  'approval evidence or bounded publication authorization drifted',
);
check(
  EN_E07_PALE_ECHO_GATE.baseCheckpoint === '6ff54c3a926436083675ec8f7e2d0230cc073ac5'
    && EN_E07_PALE_ECHO_GATE.authorizationEvidence.includes('designer replied: approved lets do next')
    && EN_E07_PALE_ECHO_GATE.authorizationEvidence.includes('Living Shadow then Doppelganger')
    && EN_E07_PALE_ECHO_GATE.authorizationEvidence.includes('only one private common Doppelganger Pale Echo'),
  'authorization evidence or bounded interpretation drifted',
);
check(
  EN_E07_PALE_ECHO_GATE.precedingApproval.gateId === EN_E07_HOLLOWCROWN_REGENT_GATE.id
    && EN_E07_PALE_ECHO_GATE.precedingApproval.candidateFrameDigest === EN_E07_HOLLOWCROWN_REGENT_GATE.candidateFrameDigest
    && EN_E07_PALE_ECHO_GATE.precedingApproval.publishedImplementation === EN_E07_HOLLOWCROWN_REGENT_GATE.publishedImplementation
    && EN_E07_PALE_ECHO_GATE.precedingApproval.publishedApprovalRecord === EN_E07_HOLLOWCROWN_REGENT_GATE.publishedApprovalRecord
    && EN_E07_PALE_ECHO_GATE.precedingApproval.currentReconciliation === '6ff54c3a926436083675ec8f7e2d0230cc073ac5',
  'approved Hollowcrown predecessor drifted',
);
check(
  EN_E07_PALE_ECHO_GATE.scope.includes('complete 80-frame Pale Echo common Doppelganger')
    && EN_E07_PALE_ECHO_GATE.animationContract.includes('lengthens the mimic hand without detaching it')
    && EN_E07_PALE_ECHO_GATE.animationContract.includes('Cast aliases Attack exactly'),
  'full-suite or motion contract drifted',
);
check(
  EN_E07_PALE_ECHO_GATE.exclusions.includes('runtime actor copying')
    && EN_E07_PALE_ECHO_GATE.exclusions.includes('public Doppelganger registration')
    && EN_E07_PALE_ECHO_GATE.exclusions.includes('asset-pack fixture generation or regeneration')
    && EN_E07_PALE_ECHO_GATE.exclusions.includes('Doppelganger specialist or elite')
    && EN_E07_PALE_ECHO_GATE.exclusions.includes('EN-E08 and later work'),
  'scope exclusions drifted',
);
check(
  EN_E07_PALE_ECHO_GATE.nextGate.includes('visually approved and published')
    && EN_E07_PALE_ECHO_GATE.nextGate.includes('remote verified')
    && EN_E07_PALE_ECHO_GATE.nextGate.includes('only one private specialist Doppelganger candidate'),
  'published next-role gate drifted',
);
check(
  JSON.stringify(EN_E07_DOPPELGANGER_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E07_DOPPELGANGER_CONTRACT_CARD.activeVariant.id === 'pale-echo'
    && EN_E07_DOPPELGANGER_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E07_DOPPELGANGER_CONTRACT_CARD.activeSpecialist.id === 'falseface-adept'
    && EN_E07_DOPPELGANGER_CONTRACT_CARD.activeSpecialist.role === 'specialist'
    && EN_E07_DOPPELGANGER_CONTRACT_CARD.activeSpecialist.status === 'implemented-full-approved'
    && EN_E07_DOPPELGANGER_CONTRACT_CARD.activeElite.id === 'grand-pretender'
    && EN_E07_DOPPELGANGER_CONTRACT_CARD.activeElite.role === 'elite'
    && EN_E07_DOPPELGANGER_CONTRACT_CARD.activeElite.status === 'implemented-full-candidate'
    && EN_E07_DOPPELGANGER_CONTRACT_CARD.deferredRoles.length === 0,
  'Doppelganger role order or active-elite boundary drifted',
);
check(
  EN_E07_PALE_ECHO_CONTRACT.silhouette.includes('uneven borrowed fringe')
    && EN_E07_PALE_ECHO_CONTRACT.silhouette.includes('one connected long-finger mimic hand')
    && EN_E07_PALE_ECHO_CONTRACT.identity.includes('without promising runtime copying')
    && EN_E07_PALE_ECHO_DATA.bakedEffects.length === 0,
  'Pale Echo authored-default identity or effect firewall drifted',
);
check(
  Object.isFrozen(EN_E07_PALE_ECHO_GATE)
    && Object.isFrozen(EN_E07_PALE_ECHO_DATA)
    && Object.isFrozen(EN_E07_PALE_ECHO_CONTRACT)
    && Object.isFrozen(EN_E07_DOPPELGANGER_CONTRACT_CARD),
  'gate, data, and contracts must be deeply immutable',
);
check(
  EN_E07_PALE_ECHO_REGISTRY.families.length === 1
    && EN_E07_PALE_ECHO_REGISTRY.publicFamilies.length === 0
    && EN_E07_PALE_ECHO_FAMILY.variants.length === 1,
  'candidate registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'doppelganger'),
  'candidate must preserve public 80/259 and keep Doppelganger private',
);
check(engine.EN_E07_PALE_ECHO_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('doppelganger'), 'public expansion registry must not mention Doppelganger');
check(!manifestSource.includes('doppelganger'), 'asset manifest must not mention Doppelganger');

const captures = new Map();
const candidateRecords = [];
const banditRecords = [];
const cultistRecords = [];
const darkElfRecords = [];
const hollowcrownRecords = [];
const palettes = [
  ['skin', new Set(EN_E07_PALE_ECHO_DATA.paleEcho.skin)],
  ['hair', new Set(EN_E07_PALE_ECHO_DATA.paleEcho.hair)],
  ['cloth', new Set(EN_E07_PALE_ECHO_DATA.paleEcho.cloth)],
  ['accent', new Set(EN_E07_PALE_ECHO_DATA.paleEcho.accent)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let colored = 0;
let flashes = 0;
let eyeViews = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let banditDifferences = 0;
let banditAlphaDifferences = 0;
let cultistDifferences = 0;
let cultistAlphaDifferences = 0;
let darkElfDifferences = 0;
let darkElfAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E07_PALE_ECHO_REGISTRY, candidateSpec, direction, animation.id, frame);
    const bandit = captureLegacyFrame(banditSpec, direction, animation.id, frame);
    const cultist = captureLegacyFrame(cultistSpec, direction, animation.id, frame);
    const darkElf = captureLegacyFrame(darkElfSpec, direction, animation.id, frame);
    const hollowcrown = captureEnemyExpansionFrame(EN_E07_HOLLOWCROWN_REGENT_REGISTRY, hollowcrownSpec, direction, animation.id, frame);
    captures.set(key, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, 'doppelganger', 'pale-echo', direction, animation.id, frame));
    banditRecords.push(frameRecord(bandit, 'bandit', 'thug', direction, animation.id, frame, false));
    cultistRecords.push(frameRecord(cultist, 'cultist', 'acolyte', direction, animation.id, frame, false));
    darkElfRecords.push(frameRecord(darkElf, 'elf', 'dark', direction, animation.id, frame, false));
    hollowcrownRecords.push(frameRecord(hollowcrown, 'living-shadow', 'hollowcrown-regent', direction, animation.id, frame));

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
    else check(false, key + ' lost boot ground contact');
    check(candidate.opaquePixels >= 145 && candidate.opaquePixels <= 310, key + ' density is implausible for a slim authored humanoid');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (candidate.digest !== bandit.digest) banditDifferences++;
    if (candidate.alphaDigest !== bandit.alphaDigest) banditAlphaDifferences++;
    if (candidate.digest !== cultist.digest) cultistDifferences++;
    if (candidate.alphaDigest !== cultist.alphaDigest) cultistAlphaDifferences++;
    if (candidate.digest !== darkElf.digest) darkElfDifferences++;
    if (candidate.alphaDigest !== darkElf.alphaDigest) darkElfAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), key + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, key + ' lost ' + name + ' palette identity');
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_PALE_ECHO_DATA.paleEcho.eye]));
      if (direction === 'up') check(eyeCount === 0, key + ' rear view must not expose eye pixels');
      else if (direction === 'down') {
        check(eyeCount === 2, key + ' front view must preserve two offset eyes');
        eyeViews++;
      } else {
        check(eyeCount === 1, key + ' side view must preserve one eye');
        eyeViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.paleEchoGate === EN_E07_PALE_ECHO_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_HOLLOWCROWN_REGENT_GATE.id,
      key + ' gate metadata drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E07_PALE_ECHO_DATA);
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
    const hurt = captures.get(direction + '/hurt/' + EN_E07_PALE_ECHO_DEATH_SOURCE_FRAMES[frame]);
    check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
  }
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const candidateDigest = hashJson(candidateRecords);
const banditDigest = hashJson(banditRecords);
const cultistDigest = hashJson(cultistRecords);
const darkElfDigest = hashJson(darkElfRecords);
const hollowcrownDigest = hashJson(hollowcrownRecords);
if (EN_E07_PALE_ECHO_GATE.candidateFrameDigest) check(candidateDigest === EN_E07_PALE_ECHO_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E07_PALE_ECHO_GATE.banditThugComparisonDigest) check(banditDigest === EN_E07_PALE_ECHO_GATE.banditThugComparisonDigest, 'Bandit Thug comparison digest drifted');
if (EN_E07_PALE_ECHO_GATE.cultistAcolyteComparisonDigest) check(cultistDigest === EN_E07_PALE_ECHO_GATE.cultistAcolyteComparisonDigest, 'Cultist Acolyte comparison digest drifted');
if (EN_E07_PALE_ECHO_GATE.darkElfComparisonDigest) check(darkElfDigest === EN_E07_PALE_ECHO_GATE.darkElfComparisonDigest, 'Dark Elf comparison digest drifted');
check(hollowcrownDigest === EN_E07_HOLLOWCROWN_REGENT_GATE.candidateFrameDigest, 'approved Hollowcrown digest drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Pale Echo frames must be connected, bounded, and grounded');
check(colored === 72 && flashes === 8 && eyeViews === 54, 'colored, flash, or eye-view totals drifted');
check(banditDifferences === 80 && banditAlphaDifferences === 80, 'Pale Echo must differ from Bandit Thug in all 80 pixel and alpha frames');
check(cultistDifferences === 80 && cultistAlphaDifferences === 80, 'Pale Echo must differ from Cultist Acolyte in all 80 pixel and alpha frames');
check(darkElfDifferences === 80 && darkElfAlphaDifferences === 80, 'Pale Echo must differ from Dark Elf in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E07_PALE_ECHO_GATE.artifactSha256) check(await fileHash(EN_E07_PALE_ECHO_GATE.artifact) === EN_E07_PALE_ECHO_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E07_PALE_ECHO_GATE.assembledArtifactSha256) check(await fileHash(EN_E07_PALE_ECHO_GATE.assembledArtifact) === EN_E07_PALE_ECHO_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E07_PALE_ECHO_GATE.comparisonArtifactSha256) check(await fileHash(EN_E07_PALE_ECHO_GATE.comparisonArtifact) === EN_E07_PALE_ECHO_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E07_PALE_ECHO_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E07_PALE_ECHO_GATE.reviewAnimations.raw.artifact) === EN_E07_PALE_ECHO_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E07_PALE_ECHO_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E07_PALE_ECHO_GATE.reviewAnimations.completeBForm.artifact) === EN_E07_PALE_ECHO_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E07_PALE_ECHO_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E07_PALE_ECHO_REGISTRY, { ...candidateSpec, family: 'living-shadow' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E07_PALE_ECHO_REGISTRY, { ...candidateSpec, variant: 'borrowed-player' }, 'down', 'idle', 0), 'runtime copied actor');

if (errors.length) {
  console.error('EN-E07 Doppelganger Pale Echo focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E07 Doppelganger Pale Echo focused gate passed.');
  console.log('- Bandit Thug distinction: ' + banditDifferences + '/80 pixel frames and ' + banditAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Cultist Acolyte distinction: ' + cultistDifferences + '/80 pixel frames and ' + cultistAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Dark Elf distinction: ' + darkElfDifferences + '/80 pixel frames and ' + darkElfAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + eyeViews + '/54 expected eye-bearing views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: approved Hollowcrown exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Public Bandit Thug frame digest: ' + banditDigest);
  console.log('- Public Cultist Acolyte frame digest: ' + cultistDigest);
  console.log('- Public Dark Elf frame digest: ' + darkElfDigest);
  console.log('- Approved Hollowcrown Regent frame digest: ' + hollowcrownDigest);
}
