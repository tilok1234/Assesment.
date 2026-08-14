import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_REGISTRY,
  EN_E11_RAVEN_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e11-raven-cinderquill-scavenger.js';
import {
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-raven-mournglass-scrier.js';
import {
  EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT,
  EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA,
  EN_E11_RAVEN_GRAVECROWN_HARROWER_DEATH_SOURCE_FRAMES,
  EN_E11_RAVEN_GRAVECROWN_HARROWER_FAMILY,
  EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE,
  EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY,
  EN_E11_RAVEN_ELITE_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e11-raven-gravecrown-harrower.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { alphaDigest, captureEnemyExpansionFrame, mirrorPixels, pixelDigest } from './enemy-expansion-review-pixels.mjs';

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
const specs = {
  candidate: { kind: 'enemy', family: 'raven', variant: 'gravecrown-harrower' },
  cinderquill: { kind: 'enemy', family: 'raven', variant: 'cinderquill-scavenger' },
  mournglass: { kind: 'enemy', family: 'raven', variant: 'mournglass-scrier' },
  harpy: { kind: 'enemy', family: 'harpy', variant: 'screech' },
};

function check(condition, message) { if (!condition) errors.push(message); }
function hashJson(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
function frameRecord(captured, spec, direction, animation, frame, candidateFamily = true) {
  return { family: spec.family, variant: spec.variant, ...(candidateFamily ? { candidateFamily: spec.family } : {}), direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds };
}

function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(576).fill(null), outOfBoundsWrites = [];
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py }); else pixels[(py * 24) + px] = null; } },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py }); else pixels[(py * 24) + px] = fillStyle; } },
  };
  drawLegacySprite(context, spec, direction, animation, frame, { shadow: false });
  const occupied = pixels.flatMap((color, index) => color === null ? [] : [{ x: index % 24, y: Math.floor(index / 24) }]);
  const bounds = occupied.length ? { minX: Math.min(...occupied.map(({ x }) => x)), minY: Math.min(...occupied.map(({ y }) => y)), maxX: Math.max(...occupied.map(({ x }) => x)), maxY: Math.max(...occupied.map(({ y }) => y)) } : null;
  return Object.freeze({ pixels: Object.freeze(pixels), opaquePixels: occupied.length, bounds: bounds && Object.freeze(bounds), outOfBoundsWrites: Object.freeze(outOfBoundsWrites), digest: pixelDigest(pixels), alphaDigest: alphaDigest(pixels) });
}

function componentCount(pixels) {
  const occupied = new Set(pixels.flatMap((color, index) => color ? [index] : []));
  let components = 0;
  while (occupied.size) {
    components++;
    const queue = [occupied.values().next().value];
    occupied.delete(queue[0]);
    while (queue.length) {
      const index = queue.shift(), x = index % 24, y = Math.floor(index / 24);
      for (const [nextX, nextY] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = (nextY * 24) + nextX;
        if (nextX >= 0 && nextY >= 0 && nextX < 24 && nextY < 24 && occupied.delete(next)) queue.push(next);
      }
    }
  }
  return components;
}

function countColors(pixels, colors) { return pixels.reduce((count, color) => count + (colors.has(color) ? 1 : 0), 0); }
function rowRuns(pixels, y) {
  let runs = 0, occupied = false;
  for (const color of pixels.slice(y * 24, (y + 1) * 24)) {
    if (color && !occupied) runs++;
    occupied = Boolean(color);
  }
  return runs;
}
async function fileHash(relativePath) { return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex'); }
function rejects(action, label, expected = 'is not implemented') {
  try { action(); errors.push(label + ' must reject'); }
  catch (error) { check(String(error.message).includes(expected), label + ' rejected unexpectedly: ' + error.message); }
}

check(
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.status === 'approved'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publicationState === 'published'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.candidateFrameDigest === '59b3b963b18edf1385fcc13252ec702cfa7d87c48ec8aaf8e34039becbfc8f1a'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publishedImplementation === 'ca79bdeced0161f720775e405416d98cd809314f'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publishedApprovalRecord === '5e50ad8bf12e6782800be71a7e7613684fc7bb49'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.initialPublishedHandoff === '930d589f4ab77598bbd11fe925a838b99e52556d',
  'published Mournglass predecessor drifted',
);
check(
  EN_E11_RAVEN_TOPOLOGY_DECISION.status === 'selected'
    && EN_E11_RAVEN_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-folded-wing-corvid'
    && EN_E11_RAVEN_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Raven topology decision drifted',
);
check(
  EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.status === 'candidate'
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.baseCheckpoint === 'd12e42ceb0375a39c60de3f4253aeaa5ac0306ae'
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.architectureDecision === EN_E11_RAVEN_TOPOLOGY_DECISION.id,
  'Gravecrown candidate gate identity or base checkpoint drifted',
);
check(
  EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.authorizationEvidence.includes('lets do next')
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.authorizationEvidence.includes('exactly one private elite Raven full 80-frame candidate')
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.authorizationEvidence.includes('elite role was not pre-named')
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.authorizationEvidence.includes('does not approve candidate pixels'),
  'Gravecrown authorization evidence drifted',
);
check(
  !('approvedOn' in EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE)
    && !('publicationState' in EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE),
  'Gravecrown candidate publication boundary drifted',
);
check(
  EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.precedingApproval.gateId === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.id
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.precedingApproval.candidateFrameDigest === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.candidateFrameDigest
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.precedingApproval.publishedImplementation === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publishedImplementation
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.precedingApproval.publishedApprovalRecord === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publishedApprovalRecord
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.precedingApproval.initialPublishedHandoff === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.initialPublishedHandoff
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.precedingApproval.currentReconciliation === 'd12e42ceb0375a39c60de3f4253aeaa5ac0306ae',
  'Gravecrown predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E11_RAVEN_ELITE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E11_RAVEN_ELITE_CONTRACT_CARD.precedingVariant.id === 'mournglass-scrier'
    && EN_E11_RAVEN_ELITE_CONTRACT_CARD.activeVariant.id === 'gravecrown-harrower'
    && EN_E11_RAVEN_ELITE_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E11_RAVEN_ELITE_CONTRACT_CARD.activeVariant.status === 'implemented-full-candidate'
    && EN_E11_RAVEN_ELITE_CONTRACT_CARD.deferredRoles.length === 0
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT.state === 'implemented-complete-motion-candidate',
  'Raven elite role contract drifted',
);
check(
  EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.actorTopology === EN_E11_RAVEN_TOPOLOGY_DECISION.selected
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.childAssets.length === 0
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.bakedEffects.length === 0
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.animationContract.includes('wide gravegate')
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.exclusions.includes('registration')
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.exclusions.includes('fixtures')
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.exclusions.includes('Owl')
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.nextGate.includes('Explicit designer approval')
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.nextGate.includes('before any implementation commit or push'),
  'Gravecrown anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E11_RAVEN_ELITE_CONTRACT_CARD)
    && Object.isFrozen(EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT)
    && Object.isFrozen(EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA)
    && Object.isFrozen(EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE),
  'Gravecrown contracts, data, and gate must be deeply immutable',
);
check(
  EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY.families.length === 1
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY.publicFamilies.length === 0
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_FAMILY.variants.length === 1,
  'private elite Raven registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
const publicRaven = engine.PUBLIC_ENEMIES.find(({ id }) => id === 'raven');
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 100 && publicVariantCount === 316, 'candidate must preserve the integrated public 100/316 catalog');
check(JSON.stringify(publicRaven?.variants.map(({ id }) => id)) === JSON.stringify(['cinderquill-scavenger']), 'public Raven must retain only approved Cinderquill Scavenger');
check(engine.EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const backlogSource = await readFile(path.join(root, 'engine', 'enemy-expansion-approved-backlog-v3.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [backlogSource, 'approved V3 backlog'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('gravecrown-harrower'), label + ' must not mention Gravecrown Harrower');
check(JSON.stringify(EN_E11_RAVEN_GRAVECROWN_HARROWER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], cinderquill: [], mournglass: [], harpy: [] };
const colors = EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.raven;
const palettes = [
  ['head', new Set(colors.head)], ['body', new Set(colors.body)], ['wing', new Set(colors.wing)],
  ['throat', new Set(colors.throat)], ['tail', new Set(colors.tail)], ['crown', new Set(colors.crown)],
  ['seal', new Set(colors.seal)], ['talon', new Set(colors.talon)],
];
const allowedActorColors = new Set(Object.values(colors).flatMap((value) => Array.isArray(value) ? value : [value]));
let connected = 0, bounded = 0, grounded = 0, twoFootRows = 0, broadEliteSpans = 0, sourceFootprints = 0, gravegateViews = 0;
let colored = 0, flashes = 0, eyeViews = 0, beakViews = 0, headViews = 0, throatViews = 0, tailViews = 0, crownViews = 0, sealViews = 0, wingViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { cinderquill: 0, mournglass: 0, harpy: 0 };
const alphaDifferences = { cinderquill: 0, mournglass: 0, harpy: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const cinderquill = captureEnemyExpansionFrame(EN_E11_RAVEN_CINDERQUILL_SCAVENGER_REGISTRY, specs.cinderquill, direction, animation.id, frame);
    const mournglass = captureEnemyExpansionFrame(EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY, specs.mournglass, direction, animation.id, frame);
    const harpy = captureLegacyFrame(specs.harpy, direction, animation.id, frame);
    const compared = { cinderquill, mournglass, harpy };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.cinderquill.push(frameRecord(cinderquill, specs.cinderquill, direction, animation.id, frame));
    records.mournglass.push(frameRecord(mournglass, specs.mournglass, direction, animation.id, frame));
    records.harpy.push(frameRecord(harpy, specs.harpy, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost talon ground contact');
    check(candidate.opaquePixels >= 180 && candidate.opaquePixels <= 440, captureKey + ' density is implausible for an elite grounded Raven');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 2) twoFootRows++; else check(false, captureKey + ' lost exactly two separated grounded three-toed foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const broadEliteSpan = (direction === 'left' || direction === 'right') ? width >= 18 && height >= 21 : width >= 16 && height >= 21;
    if (broadEliteSpan) broadEliteSpans++; else check(false, captureKey + ' lost the broad elite corvid span at ' + width + 'x' + height);
    if (mournglass.pixels.every((color, index) => !color || candidate.pixels[index])) sourceFootprints++; else check(false, captureKey + ' lost approved Mournglass anatomy');

    for (const name of Object.keys(compared)) {
      if (candidate.digest !== compared[name].digest) differences[name]++;
      if (candidate.alphaDigest !== compared[name].alphaDigest) alphaDifferences[name]++;
    }

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const frameColors = new Set(candidate.pixels.filter(Boolean));
      check(frameColors.size === 1 && frameColors.has('#f4f4f4'), captureKey + ' must be an exact whole-silhouette #f4f4f4 flash');
      flashes++;
    } else {
      check(candidate.pixels.every((color) => color === null || allowedActorColors.has(color)), captureKey + ' contains a color outside the Gravecrown actor palette');
      for (const [name, palette] of palettes) check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      check(countColors(candidate.pixels, new Set(colors.talon)) >= 8, captureKey + ' lost two broad talon contacts');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      const beakCount = countColors(candidate.pixels, new Set(colors.beak));
      if (countColors(candidate.pixels, new Set(colors.head)) >= 8) headViews++;
      if (countColors(candidate.pixels, new Set(colors.throat)) > 0) throatViews++;
      if (countColors(candidate.pixels, new Set(colors.tail)) > 0) tailViews++;
      if (countColors(candidate.pixels, new Set(colors.crown)) > 0) crownViews++;
      if (countColors(candidate.pixels, new Set(colors.seal)) > 0) sealViews++;
      if (countColors(candidate.pixels, new Set(colors.wing)) > 0) wingViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && beakCount === 0, captureKey + ' rear view must not expose eye, face, or beak pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired ember-gold eyes');
        check(featureCount === 2, captureKey + ' front view must preserve paired compact face features');
        check(beakCount >= 5, captureKey + ' front view must preserve the hooked bronze beak');
        eyeViews++; beakViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one ember-gold profile eye');
        check(featureCount === 1, captureKey + ' side view must preserve one compact profile feature');
        check(beakCount >= 6, captureKey + ' side view must preserve the hooked bronze profile beak');
        eyeViews++; beakViews++;
      }
      const gravegate = (animation.id === 'attack' || animation.id === 'cast') && (frame === 1 || frame === 2);
      if (gravegate) {
        check(countColors(candidate.pixels, new Set(colors.wing)) >= 70, captureKey + ' gravegate attack must preserve a broad oxblood mantle read');
        check(width >= 20, captureKey + ' gravegate attack must produce a broad planted silhouette');
        gravegateViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.ravenGravecrownHarrowerGate === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E11_RAVEN_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA);
    outlinedPixels += presentation.complete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
    formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
  }
  const uniqueMotion = new Set(animationDigests).size;
  if (animation.id === 'idle' || animation.id === 'hurt' || animation.id === 'death') check(uniqueMotion === 2, direction + ' ' + animation.id + ' must preserve both authored alias phases');
  else check(uniqueMotion >= 3, direction + ' ' + animation.id + ' must preserve distinct motion phases');
}

for (const direction of directions) for (let frame = 0; frame < 4; frame++) {
  const attack = captures.get(direction + '/attack/' + frame), cast = captures.get(direction + '/cast/' + frame);
  check(cast.digest === attack.digest, direction + ' Cast C' + (frame + 1) + ' must alias Attack exactly');
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E11_RAVEN_GRAVECROWN_HARROWER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.candidateFrameDigest) check(digests.candidate === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.cinderquillComparisonDigest) check(digests.cinderquill === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.cinderquillComparisonDigest, 'Cinderquill comparison digest drifted');
if (EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.mournglassComparisonDigest) check(digests.mournglass === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.mournglassComparisonDigest, 'Mournglass comparison digest drifted');
if (EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.harpyComparisonDigest) check(digests.harpy === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.harpyComparisonDigest, 'Harpy comparison digest drifted');
check(digests.cinderquill === EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest, 'approved Cinderquill comparison source drifted');
check(digests.mournglass === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.candidateFrameDigest, 'approved Mournglass comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80 && sourceFootprints === 80, 'all 80 Gravecrown frames must be connected, bounded, grounded, and retain the approved source footprint');
check(twoFootRows === 80 && broadEliteSpans === 80, 'all 80 frames must preserve two talon contacts and the broad elite corvid span');
check(
  colored === 72 && flashes === 8 && eyeViews === 54 && beakViews === 54 && headViews === 72 && throatViews === 72 && tailViews === 72 && crownViews === 72 && sealViews === 72 && wingViews === 72 && gravegateViews === 16,
  `colored, flash, eye, beak, head, throat, tail, crown, seal, wing, or gravegate totals drifted: ${colored}/${flashes}/${eyeViews}/${beakViews}/${headViews}/${throatViews}/${tailViews}/${crownViews}/${sealViews}/${wingViews}/${gravegateViews}`,
);
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Gravecrown Harrower must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.comparisonArtifact],
]) if (EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE[field]) check(await fileHash(relative) === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY, { ...specs.candidate, family: 'birdfolk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY, { ...specs.candidate, variant: 'phoenix' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E11 Raven Gravecrown Harrower focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E11 Raven Gravecrown Harrower private elite candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; source footprint ' + sourceFootprints + '/80; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Raven identity: ' + twoFootRows + '/80 two three-toed talon rows; ' + broadEliteSpans + '/80 broad elite spans; ' + gravegateViews + '/16 gravegate views; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + crownViews + '/72 gravecrown views; ' + sealViews + '/72 crimson-seal views; ' + wingViews + '/72 mantle-wing views');
  console.log('- Distinction: Cinderquill ' + differences.cinderquill + '/80; Mournglass ' + differences.mournglass + '/80; Harpy ' + differences.harpy + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Cinderquill and Mournglass exact; public Harpy and 100/316 exact; zero child assets/effects; no registration, outline registration, or fixtures');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Cinderquill frame digest: ' + digests.cinderquill);
  console.log('- Approved Mournglass frame digest: ' + digests.mournglass);
  console.log('- Public Harpy frame digest: ' + digests.harpy);
}
