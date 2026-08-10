import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { EN_E06_MIST_WEAVER_GATE, EN_E06_MIST_WEAVER_REGISTRY } from '../engine/enemy-expansion-en-e06-nymph-mist-weaver.js';
import {
  EN_E07_GLOAM_WALKER_DATA,
  EN_E07_GLOAM_WALKER_GATE,
  EN_E07_GLOAM_WALKER_REGISTRY,
  EN_E07_LIVING_SHADOW_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e07-living-shadow-gloam-walker.js';
import {
  EN_E07_NIGHTGLASS_SEER_DATA,
  EN_E07_NIGHTGLASS_SEER_GATE,
  EN_E07_NIGHTGLASS_SEER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-living-shadow-nightglass-seer.js';
import {
  EN_E07_HOLLOWCROWN_REGENT_CONTRACT,
  EN_E07_HOLLOWCROWN_REGENT_DATA,
  EN_E07_HOLLOWCROWN_REGENT_DEATH_SOURCE_FRAMES,
  EN_E07_HOLLOWCROWN_REGENT_FAMILY,
  EN_E07_HOLLOWCROWN_REGENT_GATE,
  EN_E07_HOLLOWCROWN_REGENT_REGISTRY,
} from '../engine/enemy-expansion-en-e07-living-shadow-hollowcrown-regent.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
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
const candidateSpec = { kind: 'enemy', family: 'living-shadow', variant: 'hollowcrown-regent' };
const gloamSpec = { kind: 'enemy', family: 'living-shadow', variant: 'gloam-walker' };
const nightglassSpec = { kind: 'enemy', family: 'living-shadow', variant: 'nightglass-seer' };
const ghostSpec = { kind: 'enemy', family: 'ghost', variant: 'cursed' };
const slimeSpec = { kind: 'enemy', family: 'slime', variant: 'shadow' };
const mistSpec = { kind: 'enemy', family: 'nymph', variant: 'mist-weaver' };

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

function components(pixels) {
  const seen = new Set();
  let count = 0;
  for (let index = 0; index < pixels.length; index++) {
    if (!pixels[index] || seen.has(index)) continue;
    count++;
    const queue = [index];
    seen.add(index);
    while (queue.length) {
      const current = queue.pop();
      const x = current % 24;
      const y = Math.floor(current / 24);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nx < 0 || ny < 0 || nx >= 24 || ny >= 24) continue;
        const neighbor = (ny * 24) + nx;
        if (!pixels[neighbor] || seen.has(neighbor)) continue;
        seen.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return count;
}

function countColors(pixels, colors) {
  return pixels.reduce((sum, color) => sum + (colors.has(color) ? 1 : 0), 0);
}

function mirrorPixels(pixels) {
  const result = new Array(576).fill(null);
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    result[(y * 24) + (23 - x)] = pixels[(y * 24) + x];
  }
  return result;
}

function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(576).fill(null);
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

async function sha256File(relativePath) {
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
  EN_E07_HOLLOWCROWN_REGENT_GATE.status === 'candidate'
    && EN_E07_HOLLOWCROWN_REGENT_GATE.approvedOn === null
    && EN_E07_HOLLOWCROWN_REGENT_GATE.publishedImplementation === null,
  'Hollowcrown Regent must remain an unapproved candidate',
);
check(
  EN_E07_HOLLOWCROWN_REGENT_GATE.authorizationEvidence.includes('designer replied: approved lets do next')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.authorizationEvidence.includes('common, specialist, elite')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.authorizationEvidence.includes('only one private elite Hollowcrown Regent'),
  'authorization evidence or bounded interpretation drifted',
);
check(
  EN_E07_HOLLOWCROWN_REGENT_GATE.baseCheckpoint === '46ad4e7759a1ef3a096ba326d96cdef44d1ee3b1'
    && EN_E07_HOLLOWCROWN_REGENT_GATE.precedingApproval.gateId === EN_E07_NIGHTGLASS_SEER_GATE.id
    && EN_E07_HOLLOWCROWN_REGENT_GATE.precedingApproval.candidateFrameDigest === EN_E07_NIGHTGLASS_SEER_GATE.candidateFrameDigest
    && EN_E07_HOLLOWCROWN_REGENT_GATE.precedingApproval.publishedImplementation === EN_E07_NIGHTGLASS_SEER_GATE.publishedImplementation
    && EN_E07_HOLLOWCROWN_REGENT_GATE.precedingApproval.publishedHandoff === '46ad4e7759a1ef3a096ba326d96cdef44d1ee3b1',
  'approved Nightglass Seer predecessor drifted',
);
check(
  EN_E07_HOLLOWCROWN_REGENT_GATE.scope.includes('complete 80-frame Hollowcrown Regent elite')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.animationContract.includes('crosses both bracers into an edict seal')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.animationContract.includes('diamond void-heart for a full decree')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.animationContract.includes('Cast aliases Attack exactly'),
  'full-suite or motion contract drifted',
);
check(
  EN_E07_HOLLOWCROWN_REGENT_GATE.exclusions.includes('changes to approved Gloam Walker rendered pixels')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.exclusions.includes('changes to approved Nightglass Seer rendered pixels')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.exclusions.includes('public Living Shadow registration')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.exclusions.includes('asset-pack fixture generation or regeneration')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.exclusions.includes('Doppelganger')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.exclusions.includes('EN-E08 and later work'),
  'scope exclusions drifted',
);
check(
  EN_E07_HOLLOWCROWN_REGENT_GATE.nextGate.includes('Stop at the exact frozen Hollowcrown Regent candidate review')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.nextGate.includes('Do not commit')
    && EN_E07_HOLLOWCROWN_REGENT_GATE.nextGate.includes('until the designer explicitly approves'),
  'candidate stop gate drifted',
);
check(
  Object.isFrozen(EN_E07_HOLLOWCROWN_REGENT_GATE)
    && Object.isFrozen(EN_E07_HOLLOWCROWN_REGENT_DATA)
    && Object.isFrozen(EN_E07_HOLLOWCROWN_REGENT_CONTRACT)
    && Object.isFrozen(EN_E07_LIVING_SHADOW_CONTRACT_CARD),
  'gate, data, and contracts must be deeply immutable',
);
check(
  EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeVariant.id === 'gloam-walker'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeSpecialist.id === 'nightglass-seer'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeSpecialist.role === 'specialist'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeSpecialist.status === 'implemented-full-approved'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeElite.id === 'hollowcrown-regent'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeElite.role === 'elite'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeElite.status === 'implemented-full-candidate'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.deferredRoles.length === 0,
  'Living Shadow role order or one-active-elite boundary drifted',
);
check(
  EN_E07_HOLLOWCROWN_REGENT_CONTRACT.silhouette.includes('connected three-prong hollow crown')
    && EN_E07_HOLLOWCROWN_REGENT_CONTRACT.silhouette.includes('diamond void-heart aperture')
    && EN_E07_HOLLOWCROWN_REGENT_CONTRACT.silhouette.includes('broad throne-step feet')
    && EN_E07_HOLLOWCROWN_REGENT_CONTRACT.effectBoundary.includes('Crown halos')
    && EN_E07_HOLLOWCROWN_REGENT_DATA.bakedEffects.length === 0,
  'elite identity or effect firewall drifted',
);
check(
  JSON.stringify(EN_E07_HOLLOWCROWN_REGENT_DATA.hollowcrownRegent.body) === JSON.stringify(EN_E07_GLOAM_WALKER_DATA.gloamWalker.body)
    && JSON.stringify(EN_E07_HOLLOWCROWN_REGENT_DATA.hollowcrownRegent.void) === JSON.stringify(EN_E07_GLOAM_WALKER_DATA.gloamWalker.void)
    && JSON.stringify(EN_E07_HOLLOWCROWN_REGENT_DATA.hollowcrownRegent.rim) === JSON.stringify(EN_E07_GLOAM_WALKER_DATA.gloamWalker.rim)
    && JSON.stringify(EN_E07_HOLLOWCROWN_REGENT_DATA.hollowcrownRegent.bracer) === JSON.stringify(EN_E07_GLOAM_WALKER_DATA.gloamWalker.claw)
    && JSON.stringify(EN_E07_HOLLOWCROWN_REGENT_DATA.hollowcrownRegent.bracer) === JSON.stringify(EN_E07_NIGHTGLASS_SEER_DATA.nightglassSeer.shutter)
    && EN_E07_HOLLOWCROWN_REGENT_DATA.hollowcrownRegent.eye === EN_E07_GLOAM_WALKER_DATA.gloamWalker.eye,
  'approved Living Shadow family ramp drifted',
);
check(
  EN_E07_HOLLOWCROWN_REGENT_REGISTRY.families.length === 1
    && EN_E07_HOLLOWCROWN_REGENT_REGISTRY.publicFamilies.length === 0
    && EN_E07_HOLLOWCROWN_REGENT_FAMILY.variants.length === 1,
  'candidate registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'living-shadow'),
  'candidate must preserve public 80/259 and keep Living Shadow private',
);
check(engine.EN_E07_HOLLOWCROWN_REGENT_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(
  !publicSource.includes('hollowcrown-regent')
    && !facadeSource.includes('hollowcrown-regent')
    && !manifestSource.includes('hollowcrown-regent'),
  'public or fixture firewall drifted',
);

const captures = new Map();
const candidateRecords = [];
const gloamRecords = [];
const nightglassRecords = [];
const ghostRecords = [];
const slimeRecords = [];
const mistRecords = [];
const palettes = ['body', 'void', 'rim', 'bracer'].map((name) => [
  name,
  new Set(EN_E07_HOLLOWCROWN_REGENT_DATA.hollowcrownRegent[name]),
]);
let connected = 0;
let bounded = 0;
let grounded = 0;
let colored = 0;
let flashes = 0;
let eyeFrames = 0;
let ghostDifferences = 0;
let ghostAlphaDifferences = 0;
let slimeDifferences = 0;
let slimeAlphaDifferences = 0;
let mistDifferences = 0;
let mistAlphaDifferences = 0;
let gloamDifferences = 0;
let gloamAlphaDifferences = 0;
let nightglassDifferences = 0;
let nightglassAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;

for (const animation of animations) for (const direction of directions) {
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E07_HOLLOWCROWN_REGENT_REGISTRY, candidateSpec, direction, animation.id, frame);
    const gloam = captureEnemyExpansionFrame(EN_E07_GLOAM_WALKER_REGISTRY, gloamSpec, direction, animation.id, frame);
    const nightglass = captureEnemyExpansionFrame(EN_E07_NIGHTGLASS_SEER_REGISTRY, nightglassSpec, direction, animation.id, frame);
    const ghost = captureLegacyFrame(ghostSpec, direction, animation.id, frame);
    const slime = captureLegacyFrame(slimeSpec, direction, animation.id, frame);
    const mist = captureEnemyExpansionFrame(EN_E06_MIST_WEAVER_REGISTRY, mistSpec, direction, animation.id, frame);
    captures.set(key, candidate);
    candidateRecords.push(frameRecord(candidate, 'living-shadow', 'hollowcrown-regent', direction, animation.id, frame));
    gloamRecords.push(frameRecord(gloam, 'living-shadow', 'gloam-walker', direction, animation.id, frame));
    nightglassRecords.push(frameRecord(nightglass, 'living-shadow', 'nightglass-seer', direction, animation.id, frame));
    ghostRecords.push(frameRecord(ghost, 'ghost', 'cursed', direction, animation.id, frame, false));
    slimeRecords.push(frameRecord(slime, 'slime', 'shadow', direction, animation.id, frame, false));
    mistRecords.push(frameRecord(mist, 'nymph', 'mist-weaver', direction, animation.id, frame));

    check(
      candidate.outOfBoundsWrites.length === 0
        && candidate.alpha.every((value) => value === 0 || value === 255),
      key + ' must stay in-cell with hard alpha',
    );
    const isBounded = candidate.bounds
      && candidate.bounds.minX >= 1
      && candidate.bounds.minY >= 1
      && candidate.bounds.maxX <= 22
      && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++;
    else check(false, key + ' lost one-cell margin');

    const isGrounded = candidate.bounds
      && candidate.bounds.maxY >= 21
      && candidate.bounds.maxY <= 22;
    if (isGrounded) grounded++;
    else check(false, key + ' lost wedge-foot ground contact');

    const componentCount = components(candidate.pixels);
    if (componentCount === 1) connected++;
    else check(false, key + ' has ' + componentCount + ' opaque components');

    check(
      candidate.opaquePixels >= 170 && candidate.opaquePixels <= 360,
      key + ' density ' + candidate.opaquePixels + ' is implausible for a crowned Living Shadow elite',
    );
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(ghost.pixels)) ghostDifferences++;
    else check(false, key + ' must differ from public Cursed Ghost');
    if (candidate.alphaDigest !== ghost.alphaDigest) ghostAlphaDifferences++;

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(slime.pixels)) slimeDifferences++;
    else check(false, key + ' must differ from public Shadow Slime');
    if (candidate.alphaDigest !== slime.alphaDigest) slimeAlphaDifferences++;

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(mist.pixels)) mistDifferences++;
    else check(false, key + ' must differ from approved Mist Weaver');
    if (candidate.alphaDigest !== mist.alphaDigest) mistAlphaDifferences++;

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(gloam.pixels)) gloamDifferences++;
    else check(false, key + ' must differ from approved Gloam Walker');
    if (candidate.alphaDigest !== gloam.alphaDigest) gloamAlphaDifferences++;

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(nightglass.pixels)) nightglassDifferences++;
    else check(false, key + ' must differ from approved Nightglass Seer');
    if (candidate.alphaDigest !== nightglass.alphaDigest) nightglassAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), key + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) {
        check(countColors(candidate.pixels, colors) > 0, key + ' lost ' + name + ' family-ramp identity');
      }
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_HOLLOWCROWN_REGENT_DATA.hollowcrownRegent.eye]));
      if (direction === 'up') {
        check(eyeCount === 0, key + ' rear view must not expose eye pixels');
      } else {
        const expectedEyePixels = direction === 'down' ? 4 : 2;
        check(eyeCount === expectedEyePixels, key + ' paired crown eye slits must use exactly ' + expectedEyePixels + ' eye pixels');
        if (eyeCount > 0) eyeFrames++;
      }
      colored++;
    }

    check(
      candidate.renderResult.hollowcrownRegentGate === EN_E07_HOLLOWCROWN_REGENT_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_NIGHTGLASS_SEER_GATE.id,
      key + ' gate metadata drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E07_HOLLOWCROWN_REGENT_DATA);
    completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
    formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
  }
}

for (const direction of directions) {
  for (const { id, frames } of animations.filter(({ id }) => ['idle', 'walk', 'attack', 'hurt'].includes(id))) {
    const unique = new Set(Array.from({ length: frames }, (_, frame) => JSON.stringify(captures.get(direction + '/' + id + '/' + frame).pixels)));
    check(unique.size === frames, direction + ' ' + id + ' motion frames must all be distinct');
  }
  for (let frame = 0; frame < 4; frame++) {
    const attack = captures.get(direction + '/attack/' + frame);
    const cast = captures.get(direction + '/cast/' + frame);
    check(JSON.stringify(attack.pixels) === JSON.stringify(cast.pixels), direction + ' Cast C' + (frame + 1) + ' must alias Attack A' + (frame + 1));
  }
  const hurt = [0, 1].map((frame) => captures.get(direction + '/hurt/' + frame));
  for (let frame = 0; frame < 4; frame++) {
    const death = captures.get(direction + '/death/' + frame);
    const source = hurt[EN_E07_HOLLOWCROWN_REGENT_DEATH_SOURCE_FRAMES[frame]];
    check(JSON.stringify(death.pixels) === JSON.stringify(source.pixels), direction + ' Death D' + (frame + 1) + ' alias drifted');
  }
  for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
    const right = captures.get('right/' + animation.id + '/' + frame);
    const left = captures.get('left/' + animation.id + '/' + frame);
    check(JSON.stringify(mirrorPixels(right.pixels)) === JSON.stringify(left.pixels), animation.id + ' frame ' + frame + ' side mirror drifted');
  }
}

rejects(
  () => captureEnemyExpansionFrame(EN_E07_HOLLOWCROWN_REGENT_REGISTRY, { kind: 'enemy', family: 'living-shadow', variant: 'gloam-walker' }, 'down', 'idle', 0),
  'Hollowcrown registry Gloam Walker access',
);
rejects(
  () => captureEnemyExpansionFrame(EN_E07_HOLLOWCROWN_REGENT_REGISTRY, { kind: 'enemy', family: 'living-shadow', variant: 'nightglass-seer' }, 'down', 'idle', 0),
  'Hollowcrown registry Nightglass Seer access',
);
rejects(
  () => captureEnemyExpansionFrame(EN_E07_HOLLOWCROWN_REGENT_REGISTRY, candidateSpec, 'down', 'taunt', 0),
  'Hollowcrown unsupported animation',
  'is invalid',
);

const candidateDigest = hashJson(candidateRecords);
const gloamDigest = hashJson(gloamRecords);
const nightglassDigest = hashJson(nightglassRecords);
const ghostDigest = hashJson(ghostRecords);
const slimeDigest = hashJson(slimeRecords);
const mistDigest = hashJson(mistRecords);
check(gloamDigest === EN_E07_GLOAM_WALKER_GATE.candidateFrameDigest, 'approved Gloam Walker digest drifted');
check(nightglassDigest === EN_E07_NIGHTGLASS_SEER_GATE.candidateFrameDigest, 'approved Nightglass Seer digest drifted');
check(mistDigest === EN_E06_MIST_WEAVER_GATE.candidateFrameDigest, 'approved Mist Weaver digest drifted');
if (EN_E07_HOLLOWCROWN_REGENT_GATE.candidateFrameDigest) check(candidateDigest === EN_E07_HOLLOWCROWN_REGENT_GATE.candidateFrameDigest, 'candidate frame digest drifted');
if (EN_E07_HOLLOWCROWN_REGENT_GATE.cursedGhostComparisonDigest) check(ghostDigest === EN_E07_HOLLOWCROWN_REGENT_GATE.cursedGhostComparisonDigest, 'Cursed Ghost comparison digest drifted');
if (EN_E07_HOLLOWCROWN_REGENT_GATE.shadowSlimeComparisonDigest) check(slimeDigest === EN_E07_HOLLOWCROWN_REGENT_GATE.shadowSlimeComparisonDigest, 'Shadow Slime comparison digest drifted');
if (EN_E07_HOLLOWCROWN_REGENT_GATE.mistWeaverComparisonDigest) check(mistDigest === EN_E07_HOLLOWCROWN_REGENT_GATE.mistWeaverComparisonDigest, 'Mist Weaver comparison digest drifted');
check(EN_E07_HOLLOWCROWN_REGENT_GATE.gloamWalkerComparisonDigest === gloamDigest, 'Gloam Walker comparison digest drifted');
check(EN_E07_HOLLOWCROWN_REGENT_GATE.nightglassSeerComparisonDigest === nightglassDigest, 'Nightglass Seer comparison digest drifted');

const artifacts = [
  [EN_E07_HOLLOWCROWN_REGENT_GATE.artifact, EN_E07_HOLLOWCROWN_REGENT_GATE.artifactSha256],
  [EN_E07_HOLLOWCROWN_REGENT_GATE.assembledArtifact, EN_E07_HOLLOWCROWN_REGENT_GATE.assembledArtifactSha256],
  [EN_E07_HOLLOWCROWN_REGENT_GATE.comparisonArtifact, EN_E07_HOLLOWCROWN_REGENT_GATE.comparisonArtifactSha256],
  [EN_E07_HOLLOWCROWN_REGENT_GATE.reviewAnimations.raw.artifact, EN_E07_HOLLOWCROWN_REGENT_GATE.reviewAnimations.raw.sha256],
  [EN_E07_HOLLOWCROWN_REGENT_GATE.reviewAnimations.completeBForm.artifact, EN_E07_HOLLOWCROWN_REGENT_GATE.reviewAnimations.completeBForm.sha256],
];
for (const [artifact, expected] of artifacts) {
  if (expected) check(await sha256File(artifact) === expected, artifact + ' SHA-256 drifted');
}

check(connected === 80, 'expected 80/80 connected frames, got ' + connected);
check(bounded === 80, 'expected 80/80 bounded frames, got ' + bounded);
check(grounded === 80, 'expected 80/80 grounded frames, got ' + grounded);
check(colored === 72, 'expected 72/72 colored frames, got ' + colored);
check(flashes === 8, 'expected 8/8 exact white flashes, got ' + flashes);
check(eyeFrames === 54, 'expected 54/54 eye-bearing front/side views, got ' + eyeFrames);
check(ghostDifferences === 80 && ghostAlphaDifferences === 80, 'Cursed Ghost distinction must be 80/80 pixel and alpha');
check(slimeDifferences === 80 && slimeAlphaDifferences === 80, 'Shadow Slime distinction must be 80/80 pixel and alpha');
check(mistDifferences === 80 && mistAlphaDifferences === 80, 'Mist Weaver distinction must be 80/80 pixel and alpha');
check(gloamDifferences === 80 && gloamAlphaDifferences === 80, 'Gloam Walker distinction must be 80/80 pixel and alpha');
check(nightglassDifferences === 80 && nightglassAlphaDifferences === 80, 'Nightglass Seer distinction must be 80/80 pixel and alpha');

if (errors.length) {
  console.error('EN-E07 Living Shadow Hollowcrown Regent focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E07 Living Shadow Hollowcrown Regent focused gate passed.');
console.log('- Cursed Ghost distinction: ' + ghostDifferences + '/80 pixel frames and ' + ghostAlphaDifferences + '/80 alpha silhouettes differ');
console.log('- Shadow Slime distinction: ' + slimeDifferences + '/80 pixel frames and ' + slimeAlphaDifferences + '/80 alpha silhouettes differ');
console.log('- Mist Weaver distinction: ' + mistDifferences + '/80 pixel frames and ' + mistAlphaDifferences + '/80 alpha silhouettes differ');
console.log('- Gloam Walker distinction: ' + gloamDifferences + '/80 pixel frames and ' + gloamAlphaDifferences + '/80 alpha silhouettes differ');
console.log('- Nightglass Seer distinction: ' + nightglassDifferences + '/80 pixel frames and ' + nightglassAlphaDifferences + '/80 alpha silhouettes differ');
console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
console.log('- Style identity: ' + colored + '/72 colored ramp frames; ' + flashes + '/8 exact white flashes; ' + eyeFrames + '/54 expected eye-bearing views');
console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
console.log('- Protected: approved Gloam Walker and Nightglass Seer exact; public 80/259; fixtures unchanged');
console.log('- Candidate digest: ' + candidateDigest);
console.log('- Public Cursed Ghost frame digest: ' + ghostDigest);
console.log('- Public Shadow Slime frame digest: ' + slimeDigest);
console.log('- Approved Mist Weaver frame digest: ' + mistDigest);
console.log('- Approved Gloam Walker frame digest: ' + gloamDigest);
console.log('- Approved Nightglass Seer frame digest: ' + nightglassDigest);
