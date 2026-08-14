import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E11_OWL_MOONVEIL_AUGUR_GATE,
  EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY,
} from '../engine/enemy-expansion-en-e11-owl-moonveil-augur.js';
import {
  EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT,
  EN_E11_PHOENIX_ASHCREST_KINDLER_GATE,
  EN_E11_PHOENIX_ASHCREST_KINDLER_REGISTRY,
  EN_E11_PHOENIX_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e11-phoenix-ashcrest-kindler.js';
import {
  EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT,
  EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA,
  EN_E11_PHOENIX_SUNVEIL_CANTOR_DEATH_SOURCE_FRAMES,
  EN_E11_PHOENIX_SUNVEIL_CANTOR_FAMILY,
  EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE,
  EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY,
  EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e11-phoenix-sunveil-cantor.js';
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
  candidate: { kind: 'enemy', family: 'phoenix', variant: 'sunveil-cantor' },
  ashcrest: { kind: 'enemy', family: 'phoenix', variant: 'ashcrest-kindler' },
  moonveil: { kind: 'enemy', family: 'owl', variant: 'moonveil-augur' },
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
    minX: Math.min(...occupied.map(({ x }) => x)), minY: Math.min(...occupied.map(({ y }) => y)),
    maxX: Math.max(...occupied.map(({ x }) => x)), maxY: Math.max(...occupied.map(({ y }) => y)),
  } : null;
  return Object.freeze({
    pixels: Object.freeze(pixels), opaquePixels: occupied.length,
    bounds: bounds && Object.freeze(bounds), outOfBoundsWrites: Object.freeze(outOfBoundsWrites),
    digest: pixelDigest(pixels), alphaDigest: alphaDigest(pixels),
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
function alphaDistance(left, right) {
  return left.reduce((count, color, index) => count + (Boolean(color) !== Boolean(right[index]) ? 1 : 0), 0);
}
function alphaIntersectionOverUnion(left, right) {
  let intersection = 0, union = 0;
  for (let index = 0; index < left.length; index++) {
    const a = Boolean(left[index]), b = Boolean(right[index]);
    if (a || b) union++;
    if (a && b) intersection++;
  }
  return union ? intersection / union : 1;
}
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
  EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.status === 'approved'
    && EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.publicationState === 'published'
    && EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.candidateFrameDigest === '8ed5a8436f2c0647cb1bfe09740cb8e6bfd84c6f0254c5402c547f7ef974b3b7'
    && EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.publishedImplementation === '4111b322fe6f362f92f389e606722b80426aee25'
    && EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.publishedApprovalRecord === 'c9cd3669394f0e39e05377bb9be0532e1b6204d8'
    && EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.initialPublishedHandoff === '2c12283f38fc30a6d73be5a86a67d34842aec715',
  'published Ashcrest predecessor drifted',
);
check(
  EN_E11_PHOENIX_TOPOLOGY_DECISION.status === 'approved'
    && EN_E11_PHOENIX_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-flame-crested-phoenix'
    && EN_E11_PHOENIX_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Phoenix topology decision drifted',
);
check(
  EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.status === 'approved'
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.baseCheckpoint === 'ef2d1836a88f074e48d536e92c757988a0a13d17'
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.architectureDecision === EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
  'Sunveil candidate gate identity or base checkpoint drifted',
);
check(
  EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.authorizationEvidence.includes('approved lets do next')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.authorizationEvidence.includes('exactly one private specialist Phoenix full 80-frame candidate')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.authorizationEvidence.includes('Because the specialist was not pre-named')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.authorizationEvidence.includes('lets keep working here')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.authorizationEvidence.includes('narrow private revision of Sunveil Cantor only')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.authorizationEvidence.includes('does not approve revised candidate pixels'),
  'Sunveil authorization evidence drifted',
);
check(
  EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.approvedOn === '2026-08-14'
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.approvalEvidence.includes('The designer replied: approved')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.approvalEvidence.includes('f97ddd614b58c2d3f99bc7c16e622cbd99f382455853815d17938804e859c226')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.approvalEvidence.includes('six frozen review hashes')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.approvalEvidence.includes('no continuation clause')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.approvedImplementation === 'f1fb03eedad0537d6999b3e0346ef689ba052ac0'
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.publicationAuthorizedOn === '2026-08-14'
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.publishedImplementation === 'f1fb03eedad0537d6999b3e0346ef689ba052ac0'
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.publishedApprovalRecord === '017e889275377cee23c5db57486a949bed3caa70'
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.initialPublishedHandoff === '3dd15852f6d7664febaa0610b797f589703e6ab6'
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.publicationState === 'published'
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.nextGate.includes('f1fb03eedad0537d6999b3e0346ef689ba052ac0')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.nextGate.includes('017e889275377cee23c5db57486a949bed3caa70')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.nextGate.includes('3dd15852f6d7664febaa0610b797f589703e6ab6')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.nextGate.includes('completes the bounded Phoenix specialist publication tuple')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.nextGate.includes('no continuation clause')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.nextGate.includes('outline registration'),
  'Sunveil approval record or publication boundary drifted',
);
check(
  EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.precedingApproval.gateId === EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.id
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.precedingApproval.candidateFrameDigest === EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.candidateFrameDigest
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.precedingApproval.publishedImplementation === EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.publishedImplementation
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.precedingApproval.publishedApprovalRecord === EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.publishedApprovalRecord
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.precedingApproval.initialPublishedHandoff === EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.initialPublishedHandoff
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.precedingApproval.currentReconciliation === 'ef2d1836a88f074e48d536e92c757988a0a13d17',
  'Sunveil predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD.precedingVariant.id === EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.variant
    && EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD.precedingVariant.role === 'common'
    && EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD.activeVariant.id === 'sunveil-cantor'
    && EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved-published-reconciled'
    && JSON.stringify(EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD.deferredRoles) === JSON.stringify(['elite'])
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.state === 'implemented-complete-motion-approved',
  'Phoenix specialist role contract drifted',
);
check(
  EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.actorTopology === EN_E11_PHOENIX_TOPOLOGY_DECISION.selected
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.childAssets.length === 0
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.bakedEffects.length === 0
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.animationContract.includes('bespoke long-necked processional Phoenix geometry')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.animationContract.includes('high rear arch')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.animationContract.includes('high fore arch')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.exclusions.includes('registration')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.exclusions.includes('outline registration')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.exclusions.includes('fixtures')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.exclusions.includes('egg or resurrection art')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.exclusions.includes('flight states')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.nextGate.includes('no continuation clause')
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.nextGate.includes('outline registration'),
  'Sunveil anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD)
    && Object.isFrozen(EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT)
    && Object.isFrozen(EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA)
    && Object.isFrozen(EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE),
  'Sunveil contracts, data, and gate must be deeply immutable',
);
check(
  EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY.families.length === 1
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY.publicFamilies.length === 0
    && EN_E11_PHOENIX_SUNVEIL_CANTOR_FAMILY.variants.length === 1,
  'private specialist Phoenix registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 100 && publicVariantCount === 316, 'candidate must preserve the integrated public 100/316 catalog');
check(!engine.PUBLIC_ENEMIES.some(({ id }) => id === 'phoenix'), 'candidate must keep Phoenix private');
check(engine.EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const backlogSource = await readFile(path.join(root, 'engine', 'enemy-expansion-approved-backlog-v3.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
const candidateSource = await readFile(path.join(root, 'engine', 'enemy-expansion-en-e11-phoenix-sunveil-cantor.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [backlogSource, 'approved V3 backlog'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('sunveil-cantor'), label + ' must not mention Sunveil Cantor');
check(
  !candidateSource.includes('ASHCREST_KINDLER_RENDERER')
    && !candidateSource.includes('createPaletteMappedContext')
    && candidateSource.includes('function drawSunveilCantor(')
    && candidateSource.includes("approvedSourceMotion: 'bespoke-sunveil-cantor-processional-geometry'"),
  'revised Sunveil renderer must use bespoke content geometry rather than rendering or palette-mapping Ashcrest',
);
check(JSON.stringify(EN_E11_PHOENIX_SUNVEIL_CANTOR_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], ashcrest: [], moonveil: [], harpy: [] };
const colors = EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.phoenix;
const palettes = [
  ['head', new Set(colors.head)], ['body', new Set(colors.body)], ['wing', new Set(colors.wing)],
  ['breast', new Set(colors.breast)], ['tail', new Set(colors.tail)], ['crest', new Set(colors.crest)],
  ['beak', new Set(colors.beak)], ['talon', new Set(colors.talon)],
  ['veil', new Set(colors.veil)], ['cantor', new Set(colors.cantor)],
];
const allowedActorColors = new Set(Object.values(colors).flatMap((value) => Array.isArray(value) ? value : [value]));
let connected = 0, bounded = 0, grounded = 0, twoFootRows = 0, specialistSpans = 0, bespokeSilhouettes = 0, processionalProfiles = 0, dawnscreenViews = 0;
let colored = 0, flashes = 0, eyeViews = 0, beakViews = 0, headViews = 0, breastViews = 0, tailViews = 0, crestViews = 0, wingViews = 0, veilViews = 0, cantorViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, minAshcrestAlphaDistance = Infinity, maxAshcrestAlphaIou = 0, outlinedPixels = 0, formChanges = 0;
const differences = { ashcrest: 0, moonveil: 0, harpy: 0 };
const alphaDifferences = { ashcrest: 0, moonveil: 0, harpy: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY, specs.candidate, direction, animation.id, frame);
    const ashcrest = captureEnemyExpansionFrame(EN_E11_PHOENIX_ASHCREST_KINDLER_REGISTRY, specs.ashcrest, direction, animation.id, frame);
    const moonveil = captureEnemyExpansionFrame(EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY, specs.moonveil, direction, animation.id, frame);
    const harpy = captureLegacyFrame(specs.harpy, direction, animation.id, frame);
    const compared = { ashcrest, moonveil, harpy };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.ashcrest.push(frameRecord(ashcrest, specs.ashcrest, direction, animation.id, frame));
    records.moonveil.push(frameRecord(moonveil, specs.moonveil, direction, animation.id, frame));
    records.harpy.push(frameRecord(harpy, specs.harpy, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost talon ground contact');
    check(candidate.opaquePixels >= 180 && candidate.opaquePixels <= 450, captureKey + ' density is implausible for a specialist grounded Phoenix');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 2) twoFootRows++; else check(false, captureKey + ' lost exactly two separated grounded three-toed foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const specialistSpan = width >= 16 && height >= 20;
    if (specialistSpan) specialistSpans++; else check(false, captureKey + ' lost the connected specialist Phoenix span at ' + width + 'x' + height);
    const ashcrestDistance = alphaDistance(candidate.pixels, ashcrest.pixels);
    const ashcrestIou = alphaIntersectionOverUnion(candidate.pixels, ashcrest.pixels);
    minAshcrestAlphaDistance = Math.min(minAshcrestAlphaDistance, ashcrestDistance);
    maxAshcrestAlphaIou = Math.max(maxAshcrestAlphaIou, ashcrestIou);
    if (ashcrestDistance >= 64 && ashcrestIou <= 0.74) bespokeSilhouettes++;
    else check(false, `${captureKey} is too close to Ashcrest's black shape: alpha distance ${ashcrestDistance}, IoU ${ashcrestIou.toFixed(3)}`);
    if (direction === 'left' || direction === 'right') {
      if (width >= 18 && height >= 20) processionalProfiles++;
      else check(false, captureKey + ' lost the long-necked low-bodied processional profile at ' + width + 'x' + height);
    }

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
      check(candidate.pixels.every((color) => color === null || allowedActorColors.has(color)), captureKey + ' contains a color outside the Sunveil actor palette');
      for (const [name, palette] of palettes) {
        if (direction === 'up' && name === 'beak') continue;
        if ((direction === 'left' || direction === 'right') && (animation.id === 'attack' || animation.id === 'cast') && frame === 2 && name === 'breast') continue;
        check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      }
      check(countColors(candidate.pixels, new Set(colors.talon)) >= 8, captureKey + ' lost two broad talon contacts');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      const beakCount = countColors(candidate.pixels, new Set(colors.beak));
      if (countColors(candidate.pixels, new Set(colors.head)) >= 7) headViews++;
      if (countColors(candidate.pixels, new Set(colors.breast)) > 0) breastViews++;
      if (countColors(candidate.pixels, new Set(colors.tail)) > 0) tailViews++;
      if (countColors(candidate.pixels, new Set(colors.crest)) > 0) crestViews++;
      if (countColors(candidate.pixels, new Set(colors.wing)) > 0) wingViews++;
      if (countColors(candidate.pixels, new Set(colors.veil)) > 0) veilViews++;
      if (countColors(candidate.pixels, new Set(colors.cantor)) > 0) cantorViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && beakCount === 0, captureKey + ' rear view must not expose eye, face, or beak pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired pale-gold eyes');
        check(featureCount === 2, captureKey + ' front view must preserve paired compact face features');
        check(beakCount >= 5, captureKey + ' front view must preserve the hooked brass beak');
        eyeViews++; beakViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one pale-gold profile eye');
        check(featureCount === 1, captureKey + ' side view must preserve one compact profile feature');
        check(beakCount >= 6, captureKey + ' side view must preserve the hooked brass profile beak');
        eyeViews++; beakViews++;
      }
      const dawnscreen = (animation.id === 'attack' || animation.id === 'cast') && (frame === 1 || frame === 2);
      if (dawnscreen) {
        const mantlePixels = countColors(candidate.pixels, new Set([...colors.veil, ...colors.cantor]));
        const elevatedMantlePixels = candidate.pixels.slice(0, 10 * 24).reduce(
          (count, color) => count + (color && new Set([...colors.wing, ...colors.veil, ...colors.cantor]).has(color) ? 1 : 0),
          0,
        );
        check(mantlePixels >= 25, captureKey + ' dawnscreen attack must preserve the asymmetric pale-and-dawn mantle; found ' + mantlePixels);
        check(width >= 20, captureKey + ' dawnscreen attack must produce a broad planted silhouette');
        check(elevatedMantlePixels >= 18, captureKey + ' dawnscreen attack must raise a body-owned wing arch above the torso; found ' + elevatedMantlePixels);
        dawnscreenViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.phoenixSunveilCantorGate === EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.id
        && candidate.renderResult.architectureDecision === EN_E11_PHOENIX_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E11_PHOENIX_SUNVEIL_CANTOR_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.candidateFrameDigest) check(digests.candidate === EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.ashcrestComparisonDigest) check(digests.ashcrest === EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.ashcrestComparisonDigest, 'Ashcrest comparison digest drifted');
if (EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.moonveilComparisonDigest) check(digests.moonveil === EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.moonveilComparisonDigest, 'Moonveil comparison digest drifted');
if (EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.harpyComparisonDigest) check(digests.harpy === EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.harpyComparisonDigest, 'Harpy comparison digest drifted');
check(digests.ashcrest === EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.candidateFrameDigest, 'approved Ashcrest comparison source drifted');
check(digests.moonveil === EN_E11_OWL_MOONVEIL_AUGUR_GATE.candidateFrameDigest, 'approved Moonveil comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80 && bespokeSilhouettes === 80, 'all 80 Sunveil frames must be connected, bounded, grounded, and substantially distinct from Ashcrest in black shape');
check(twoFootRows === 80 && specialistSpans === 80 && processionalProfiles === 40, 'all 80 frames must preserve two talon contacts and the specialist span, including all 40 long processional side profiles');
check(
  colored === 72 && flashes === 8 && eyeViews === 54 && beakViews === 54 && headViews === 72 && breastViews === 72 && tailViews === 72 && crestViews === 72 && wingViews === 72 && veilViews === 72 && cantorViews === 72 && dawnscreenViews === 16,
  `colored, flash, eye, beak, head, breast, tail, crest, wing, veil, cantor, or dawnscreen totals drifted: ${colored}/${flashes}/${eyeViews}/${beakViews}/${headViews}/${breastViews}/${tailViews}/${crestViews}/${wingViews}/${veilViews}/${cantorViews}/${dawnscreenViews}`,
);
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Sunveil Cantor must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.artifact],
  ['outlinedArtifactSha256', EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.comparisonArtifact],
]) if (EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE[field]) check(await fileHash(relative) === EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY, { ...specs.candidate, family: 'birdfolk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY, { ...specs.candidate, variant: 'phoenix' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E11 Phoenix Sunveil Cantor focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E11 Phoenix Sunveil Cantor approved private specialist passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Bespoke silhouette: ' + bespokeSilhouettes + '/80 substantial Ashcrest black-shape differences; minimum alpha distance ' + minAshcrestAlphaDistance + '; maximum IoU ' + maxAshcrestAlphaIou.toFixed(3) + '; ' + processionalProfiles + '/40 long side profiles');
  console.log('- Phoenix identity: ' + twoFootRows + '/80 two three-toed talon rows; ' + specialistSpans + '/80 specialist spans; ' + dawnscreenViews + '/16 alternating high-arch dawnscreen views; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + veilViews + '/72 sunveil views; ' + cantorViews + '/72 cantor-mantle views; ' + wingViews + '/72 body-owned wing views');
  console.log('- Distinction: Ashcrest ' + differences.ashcrest + '/80; Moonveil ' + differences.moonveil + '/80; Harpy ' + differences.harpy + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Ashcrest and Moonveil exact; public Harpy and 100/316 exact; zero child assets/effects; no registration, outline registration, fixtures, or broader gate');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Ashcrest frame digest: ' + digests.ashcrest);
  console.log('- Approved Moonveil frame digest: ' + digests.moonveil);
  console.log('- Public Harpy frame digest: ' + digests.harpy);
}
