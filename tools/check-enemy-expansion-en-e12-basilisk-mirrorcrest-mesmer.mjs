import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE,
  EN_E11_COCKATRICE_GLOAMGAZE_STALKER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-cockatrice-gloamgaze-stalker.js';
import {
  EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE,
  EN_E12_BASILISK_CROWNSCALE_CRAWLER_REGISTRY,
  EN_E12_BASILISK_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e12-basilisk-crownscale-crawler.js';
import {
  EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD,
  EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT,
  EN_E12_BASILISK_MIRRORCREST_MESMER_DATA,
  EN_E12_BASILISK_MIRRORCREST_MESMER_DEATH_SOURCE_FRAMES,
  EN_E12_BASILISK_MIRRORCREST_MESMER_FAMILY,
  EN_E12_BASILISK_MIRRORCREST_MESMER_GATE,
  EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY,
} from '../engine/enemy-expansion-en-e12-basilisk-mirrorcrest-mesmer.js';
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
  candidate: { kind: 'enemy', family: 'basilisk', variant: 'mirrorcrest-mesmer' },
  crownscale: { kind: 'enemy', family: 'basilisk', variant: 'crownscale-crawler' },
  gloamgaze: { kind: 'enemy', family: 'cockatrice', variant: 'gloamgaze-stalker' },
  marshCrocodile: { kind: 'enemy', family: 'crocodile', variant: 'marsh' },
};

function check(condition, message) { if (!condition) errors.push(message); }
function hashJson(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
function frameRecord(captured, spec, direction, animation, frame, candidateFamily = false) {
  return { family: spec.family, variant: spec.variant, ...(candidateFamily ? { candidateFamily: spec.family } : {}), direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds };
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
function alphaDistance(left, right) { return left.reduce((count, color, index) => count + (Boolean(color) !== Boolean(right[index]) ? 1 : 0), 0); }
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
  const bounds = occupied.length ? { minX: Math.min(...occupied.map(({ x }) => x)), minY: Math.min(...occupied.map(({ y }) => y)), maxX: Math.max(...occupied.map(({ x }) => x)), maxY: Math.max(...occupied.map(({ y }) => y)) } : null;
  return Object.freeze({ pixels: Object.freeze(pixels), opaquePixels: occupied.length, bounds: bounds && Object.freeze(bounds), outOfBoundsWrites: Object.freeze(outOfBoundsWrites), digest: pixelDigest(pixels), alphaDigest: alphaDigest(pixels) });
}

check(
  EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.status === 'approved'
    && EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.publicationState === 'published'
    && EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.candidateFrameDigest === '96283b7a295071acaa7541a44ccccbd6c99af0523b4e66d69cb5c9a706cd9872'
    && EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.publishedImplementation === '3071d18d98b84ca1492e88ab85bf7765aa7ee0d0'
    && EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.publishedApprovalRecord === 'fd734af1df0a6b2ab1712533892e2a9e18c5984c'
    && EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.initialPublishedHandoff === '06249d3ce2924a1010ab6a8edd927ab934c50380',
  'published Crownscale predecessor tuple drifted',
);
check(
  EN_E12_BASILISK_TOPOLOGY_DECISION.status === 'approved'
    && EN_E12_BASILISK_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-four-clawed-crowned-serpent'
    && EN_E12_BASILISK_TOPOLOGY_DECISION.approvedOn === '2026-08-15'
    && EN_E12_BASILISK_TOPOLOGY_DECISION.approvalEvidence.includes('awesome lets do next')
    && EN_E12_BASILISK_TOPOLOGY_DECISION.approvalEvidence.includes('The designer replied approved')
    && EN_E12_BASILISK_TOPOLOGY_DECISION.approvalEvidence.includes('exactly one private common Basilisk 80-frame candidate')
    && EN_E12_BASILISK_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Basilisk topology decision drifted',
);
check(
  EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.status === 'approved'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.baseCheckpoint === 'e894fc126c33fd94c49c077f8dc0432dfabe753a'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.architectureDecision === EN_E12_BASILISK_TOPOLOGY_DECISION.id
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.precedingApproval.gateId === EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.id
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.precedingApproval.candidateFrameDigest === EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.candidateFrameDigest
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.precedingApproval.publishedImplementation === EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.publishedImplementation
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.precedingApproval.publishedApprovalRecord === EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.publishedApprovalRecord
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.precedingApproval.initialPublishedHandoff === EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.initialPublishedHandoff
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.precedingApproval.currentReconciliation === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.baseCheckpoint,
  'Mirrorcrest approved gate identity or predecessor tuple drifted',
);
check(
  EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.approvedOn === '2026-08-15'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.approvalEvidence.includes('The designer replied: approved letsd do next')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.approvalEvidence.includes('3ff5c75cd5272e66cfad42b84c5dbb1e86c20b67f506845923734cda24569a80')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.approvalEvidence.includes('six frozen review hashes')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.approvedImplementation === '9c020537525094430307813e77fd23d7e6308fcc'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publicationAuthorizedOn === '2026-08-15'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publishedImplementation === ''
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publishedApprovalRecord === ''
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.initialPublishedHandoff === ''
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publicationState === 'approved-not-published'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.nextGate.includes('9c020537525094430307813e77fd23d7e6308fcc')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.nextGate.includes('approval record')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.nextGate.includes('private elite Basilisk candidate')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.nextGate.includes('does not approve elite pixels'),
  'Mirrorcrest approval record or publication boundary drifted',
);
check(
  EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.authorizationEvidence.includes('Approved lets do next')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.authorizationEvidence.includes('exactly one private specialist Basilisk full 80-frame candidate')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.authorizationEvidence.includes('names only Mirrorcrest Mesmer')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.authorizationEvidence.includes('does not approve candidate pixels'),
  'Mirrorcrest authorization evidence drifted',
);
check(
  JSON.stringify(EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD.precedingGate === EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.id
    && EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD.precedingVariant.id === 'crownscale-crawler'
    && EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD.precedingVariant.role === 'common'
    && EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD.activeVariant.id === 'mirrorcrest-mesmer'
    && EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD.deferredRoles) === JSON.stringify(['elite'])
    && EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT.state === 'implemented-complete-motion-approved',
  'Basilisk specialist role contract drifted',
);
check(
  EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.actorTopology === EN_E12_BASILISK_TOPOLOGY_DECISION.selected
    && EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.childAssets.length === 0
    && EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.bakedEffects.length === 0
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.animationContract.includes('braces all four claws')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.animationContract.includes('body-owned aperture')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.exclusions.includes('registration')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.exclusions.includes('outline registration')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.exclusions.includes('fixtures')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.exclusions.includes('Manticore or Sphinx')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.nextGate.includes('private elite Basilisk candidate')
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.nextGate.includes('outline registration'),
  'Mirrorcrest anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E12_BASILISK_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD)
    && Object.isFrozen(EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT)
    && Object.isFrozen(EN_E12_BASILISK_MIRRORCREST_MESMER_DATA)
    && Object.isFrozen(EN_E12_BASILISK_MIRRORCREST_MESMER_GATE),
  'Mirrorcrest topology, contracts, data, and gate must be deeply immutable',
);
check(
  EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY.families.length === 1
    && EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY.publicFamilies.length === 0
    && EN_E12_BASILISK_MIRRORCREST_MESMER_FAMILY.variants.length === 1,
  'private specialist Basilisk registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 100 && publicVariantCount === 316, 'approved private specialist must preserve the integrated public 100/316 catalog');
check(!engine.PUBLIC_ENEMIES.some(({ id }) => id === 'basilisk'), 'approved private specialist must keep Basilisk private');
check(engine.EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY === undefined, 'approved private specialist must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const backlogSource = await readFile(path.join(root, 'engine', 'enemy-expansion-approved-backlog-v3.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
const candidateSource = await readFile(path.join(root, 'engine', 'enemy-expansion-en-e12-basilisk-mirrorcrest-mesmer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [backlogSource, 'approved V3 backlog'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('mirrorcrest-mesmer'), label + ' must not mention Mirrorcrest Mesmer');
check(
  !candidateSource.includes('EN_E12_BASILISK_CROWNSCALE_CRAWLER_RENDERER')
    && !candidateSource.includes('EN_E11_COCKATRICE_GLOAMGAZE_STALKER_RENDERER')
    && !candidateSource.includes('drawLegacySprite')
    && !candidateSource.includes('createPaletteMappedContext')
    && candidateSource.includes('function drawBasiliskMirrorcrestMesmerAnatomy('),
  'Mirrorcrest renderer must use bespoke Basilisk geometry rather than rendering or palette-mapping a comparator',
);
check(JSON.stringify(EN_E12_BASILISK_MIRRORCREST_MESMER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], crownscale: [], gloamgaze: [], marshCrocodile: [] };
const colors = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
const palettes = [
  ['hide', new Set(colors.hide)], ['plate', new Set(colors.plate)], ['belly', new Set(colors.belly)],
  ['crown', new Set(colors.crown)], ['claw', new Set(colors.claw)], ['scale', new Set(colors.scale)],
];
const allowedActorColors = new Set(Object.values(colors).flatMap((value) => Array.isArray(value) ? value : [value]));
let connected = 0, bounded = 0, grounded = 0, fourFootRows = 0, specialistSpans = 0, sideLongSpans = 0;
let colored = 0, flashes = 0, eyeViews = 0, jawViews = 0, fangViews = 0, crownViews = 0, plateViews = 0, clawViews = 0, scaleViews = 0;
let apertureRiseViews = 0, gazeLockViews = 0, minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { crownscale: 0, gloamgaze: 0, marshCrocodile: 0 };
const alphaDifferences = { crownscale: 0, gloamgaze: 0, marshCrocodile: 0 };
const alphaStats = {
  crownscale: { minDistance: Infinity, maxIou: 0 },
  gloamgaze: { minDistance: Infinity, maxIou: 0 },
  marshCrocodile: { minDistance: Infinity, maxIou: 0 },
};

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const crownscale = captureEnemyExpansionFrame(EN_E12_BASILISK_CROWNSCALE_CRAWLER_REGISTRY, specs.crownscale, direction, animation.id, frame);
    const gloamgaze = captureEnemyExpansionFrame(EN_E11_COCKATRICE_GLOAMGAZE_STALKER_REGISTRY, specs.gloamgaze, direction, animation.id, frame);
    const marshCrocodile = captureLegacyFrame(specs.marshCrocodile, direction, animation.id, frame);
    const compared = { crownscale, gloamgaze, marshCrocodile };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame, true));
    records.crownscale.push(frameRecord(crownscale, specs.crownscale, direction, animation.id, frame, true));
    records.gloamgaze.push(frameRecord(gloamgaze, specs.gloamgaze, direction, animation.id, frame, true));
    records.marshCrocodile.push(frameRecord(marshCrocodile, specs.marshCrocodile, direction, animation.id, frame));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost claw ground contact');
    check(candidate.opaquePixels >= 180 && candidate.opaquePixels <= 310, captureKey + ' density is implausible for a lean specialist Basilisk');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 4) fourFootRows++; else check(false, captureKey + ' lost exactly four separately grounded claw runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    if (width >= 19 && height >= 19) specialistSpans++; else check(false, captureKey + ' lost the specialist mirrorcrest span at ' + width + 'x' + height);
    if (direction === 'left' || direction === 'right') {
      if (width >= 22) sideLongSpans++; else check(false, captureKey + ' lost the long-body side silhouette');
    }

    for (const [name, comparison] of Object.entries(compared)) {
      if (candidate.digest !== comparison.digest) differences[name]++;
      if (candidate.alphaDigest !== comparison.alphaDigest) alphaDifferences[name]++;
      const distance = alphaDistance(candidate.pixels, comparison.pixels);
      const iou = alphaIntersectionOverUnion(candidate.pixels, comparison.pixels);
      alphaStats[name].minDistance = Math.min(alphaStats[name].minDistance, distance);
      alphaStats[name].maxIou = Math.max(alphaStats[name].maxIou, iou);
      check(distance >= 55 && iou <= 0.80, `${captureKey} is too close to ${name} in black shape: alpha distance ${distance}, IoU ${iou.toFixed(3)}`);
    }

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const frameColors = new Set(candidate.pixels.filter(Boolean));
      check(frameColors.size === 1 && frameColors.has('#f4f4f4'), captureKey + ' must be an exact whole-silhouette #f4f4f4 flash');
      flashes++;
    } else {
      check(candidate.pixels.every((color) => color === null || allowedActorColors.has(color)), captureKey + ' contains a color outside the Mirrorcrest actor palette');
      for (const [name, palette] of palettes) {
        if (direction === 'up' && name === 'belly') continue;
        check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      }
      check(countColors(candidate.pixels, new Set(colors.claw)) >= 28, captureKey + ' lost four splayed rose-copper claw contacts');
      check(countColors(candidate.pixels, new Set(colors.crown)) >= 20, captureKey + ' lost the connected split moon-silver mirror crest');
      check(countColors(candidate.pixels, new Set(colors.scale)) >= 3, captureKey + ' lost scale markings');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      const jawCount = countColors(candidate.pixels, new Set(colors.jaw));
      const fangCount = countColors(candidate.pixels, new Set(colors.fang));
      if (countColors(candidate.pixels, new Set(colors.crown)) > 0) crownViews++;
      if (countColors(candidate.pixels, new Set(colors.plate)) > 0) plateViews++;
      if (countColors(candidate.pixels, new Set(colors.claw)) > 0) clawViews++;
      if (countColors(candidate.pixels, new Set(colors.scale)) > 0) scaleViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && jawCount === 0 && fangCount === 0, captureKey + ' rear view must not expose eye, face, jaw, or fang pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2 && featureCount === 2, captureKey + ' front view must preserve paired cyan eyes and diamond-face features');
        check(jawCount > 0 && fangCount === 2, captureKey + ' front view must preserve the dark plum jaw and two ivory fangs');
        eyeViews++; jawViews++; fangViews++;
      } else {
        check(eyeCount === 1 && featureCount === 1, captureKey + ' side view must preserve one cyan profile eye and face feature');
        check(jawCount > 0 && fangCount === 1, captureKey + ' side view must preserve the plum diamond jaw and one profile fang');
        eyeViews++; jawViews++; fangViews++;
      }
      if ((animation.id === 'attack' || animation.id === 'cast') && frame === 1) {
        check(candidate.bounds.minY === 1, captureKey + ' split-aperture phase must reach the high connected silhouette band');
        apertureRiseViews++;
      }
      if ((animation.id === 'attack' || animation.id === 'cast') && frame === 2) {
        check(candidate.renderResult.renderedAnimation === 'attack' && candidate.renderResult.renderedFrame === 2, captureKey + ' must preserve the body-owned gaze-lock phase');
        gazeLockViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.basiliskMirrorcrestMesmerGate === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E12_BASILISK_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E12_BASILISK_MIRRORCREST_MESMER_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E12_BASILISK_MIRRORCREST_MESMER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.candidateFrameDigest) check(digests.candidate === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.crownscaleComparisonDigest) check(digests.crownscale === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.crownscaleComparisonDigest, 'Crownscale comparison digest drifted');
if (EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.gloamgazeComparisonDigest) check(digests.gloamgaze === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.gloamgazeComparisonDigest, 'Gloamgaze comparison digest drifted');
if (EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.marshCrocodileComparisonDigest) check(digests.marshCrocodile === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.marshCrocodileComparisonDigest, 'Marsh Crocodile comparison digest drifted');
check(digests.crownscale === EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.candidateFrameDigest, 'approved Crownscale comparison source drifted');
check(digests.gloamgaze === EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.candidateFrameDigest, 'approved Gloamgaze comparison source drifted');
check(digests.marshCrocodile === 'aaabe38311ec314f97b902e92ee6f426199f33c2f5051e8a7ffc7a58c737a19a', 'public Marsh Crocodile comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Mirrorcrest frames must be connected, bounded, and grounded');
check(fourFootRows === 80 && specialistSpans === 80 && sideLongSpans === 40, 'all 80 frames must preserve four claw contacts and the specialist span, including all 40 long-body side views');
check(colored === 72 && flashes === 8 && eyeViews === 54 && jawViews === 54 && fangViews === 54 && crownViews === 72 && plateViews === 72 && clawViews === 72 && scaleViews === 72 && apertureRiseViews === 8 && gazeLockViews === 8, 'colored, flash, face, crest, plate, claw, scale, aperture-rise, or gaze-lock totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Mirrorcrest Mesmer must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.comparisonArtifact],
]) if (EN_E12_BASILISK_MIRRORCREST_MESMER_GATE[field]) check(await fileHash(relative) === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY, { ...specs.candidate, family: 'naga' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY, { ...specs.candidate, variant: 'manticore' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E12 Basilisk Mirrorcrest Mesmer focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E12 Basilisk Mirrorcrest Mesmer approved private specialist passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Basilisk identity: ' + fourFootRows + '/80 four-claw ground rows; ' + specialistSpans + '/80 specialist spans; ' + sideLongSpans + '/40 long-body side views; ' + apertureRiseViews + '/8 split-aperture rises; ' + gazeLockViews + '/8 body-owned gaze locks; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + crownViews + '/72 mirrorcrest views; ' + plateViews + '/72 opaline-plate views; ' + scaleViews + '/72 scale-marked views');
  console.log('- Black-shape distinction: Crownscale minimum distance ' + alphaStats.crownscale.minDistance + ', max IoU ' + alphaStats.crownscale.maxIou.toFixed(3) + '; Gloamgaze minimum distance ' + alphaStats.gloamgaze.minDistance + ', max IoU ' + alphaStats.gloamgaze.maxIou.toFixed(3) + '; Marsh Crocodile minimum distance ' + alphaStats.marshCrocodile.minDistance + ', max IoU ' + alphaStats.marshCrocodile.maxIou.toFixed(3));
  console.log('- Distinction: Crownscale ' + differences.crownscale + '/80; Gloamgaze ' + differences.gloamgaze + '/80; Marsh Crocodile ' + differences.marshCrocodile + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: published Crownscale exact; approved Gloamgaze exact; public Marsh Crocodile and 100/316 exact; zero child assets/effects; bounded publication only; no registration, outline registration, fixtures, package mutation, or broader EN-E12 work');
  console.log('- Approved Mirrorcrest frame digest: ' + digests.candidate);
  console.log('- Approved Crownscale frame digest: ' + digests.crownscale);
  console.log('- Approved Gloamgaze frame digest: ' + digests.gloamgaze);
  console.log('- Public Marsh Crocodile frame digest: ' + digests.marshCrocodile);
}
