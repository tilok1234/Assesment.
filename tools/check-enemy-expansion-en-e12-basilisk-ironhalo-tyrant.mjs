import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE,
  EN_E12_BASILISK_CROWNSCALE_CRAWLER_REGISTRY,
  EN_E12_BASILISK_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e12-basilisk-crownscale-crawler.js';
import {
  EN_E12_BASILISK_MIRRORCREST_MESMER_GATE,
  EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY,
} from '../engine/enemy-expansion-en-e12-basilisk-mirrorcrest-mesmer.js';
import {
  EN_E12_BASILISK_ELITE_CONTRACT_CARD,
  EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT,
  EN_E12_BASILISK_IRONHALO_TYRANT_DATA,
  EN_E12_BASILISK_IRONHALO_TYRANT_DEATH_SOURCE_FRAMES,
  EN_E12_BASILISK_IRONHALO_TYRANT_FAMILY,
  EN_E12_BASILISK_IRONHALO_TYRANT_GATE,
  EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY,
} from '../engine/enemy-expansion-en-e12-basilisk-ironhalo-tyrant.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { alphaDigest, captureEnemyExpansionFrame, mirrorPixels, pixelDigest } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const directions = ['down', 'left', 'right', 'up'];
const animations = [
  { id: 'idle', frames: 2 }, { id: 'walk', frames: 4 }, { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 }, { id: 'hurt', frames: 2 }, { id: 'death', frames: 4 },
];
const specs = {
  candidate: { kind: 'enemy', family: 'basilisk', variant: 'ironhalo-tyrant' },
  crownscale: { kind: 'enemy', family: 'basilisk', variant: 'crownscale-crawler' },
  mirrorcrest: { kind: 'enemy', family: 'basilisk', variant: 'mirrorcrest-mesmer' },
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
    const queue = [occupied.values().next().value]; occupied.delete(queue[0]);
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
function regionalAlphaDistance(left, right, { minX = 0, minY = 0, maxX = 23, maxY = 23 } = {}) {
  let distance = 0;
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    const index = (y * 24) + x;
    if (Boolean(left[index]) !== Boolean(right[index])) distance++;
  }
  return distance;
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
function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(576).fill(null), outOfBoundsWrites = [];
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
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
    && EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.candidateFrameDigest === '96283b7a295071acaa7541a44ccccbd6c99af0523b4e66d69cb5c9a706cd9872',
  'published Crownscale source gate drifted',
);
check(
  EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.status === 'approved'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publicationState === 'published'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.candidateFrameDigest === '3ff5c75cd5272e66cfad42b84c5dbb1e86c20b67f506845923734cda24569a80'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publishedImplementation === '9c020537525094430307813e77fd23d7e6308fcc'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publishedApprovalRecord === '7ecc9df1f7f05c38af6cd395bfd26811a0d79099'
    && EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.initialPublishedHandoff === 'a983959ccf0fb6c965fcb04e534c170f8b1f854b',
  'published Mirrorcrest predecessor tuple drifted',
);
check(
  EN_E12_BASILISK_TOPOLOGY_DECISION.status === 'approved'
    && EN_E12_BASILISK_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-four-clawed-crowned-serpent'
    && EN_E12_BASILISK_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Basilisk topology decision drifted',
);
check(
  EN_E12_BASILISK_IRONHALO_TYRANT_GATE.status === 'approved'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.baseCheckpoint === '1b1b11ba6464bdf2bb1220b094e6908578f7a7aa'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.architectureDecision === EN_E12_BASILISK_TOPOLOGY_DECISION.id
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.precedingApproval.gateId === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.precedingApproval.candidateFrameDigest === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.candidateFrameDigest
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.precedingApproval.publishedImplementation === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publishedImplementation
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.precedingApproval.publishedApprovalRecord === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publishedApprovalRecord
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.precedingApproval.initialPublishedHandoff === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.initialPublishedHandoff
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.precedingApproval.currentReconciliation === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.baseCheckpoint,
  'Ironhalo approved gate identity or predecessor tuple drifted',
);
check(
  EN_E12_BASILISK_IRONHALO_TYRANT_GATE.approvedOn === '2026-08-15'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.approvalEvidence.includes('The designer replied: aproved')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.approvalEvidence.includes('ea00f445e8f807098b6392cd3cf81fedbf0a29d6eb96434495ab5af9b3308a6f')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.approvalEvidence.includes('six frozen review hashes')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.approvalEvidence.includes('no continuation request')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.approvedImplementation === '7a00ef8691da6df2821cf3ad02437198d0d9f2e6'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publicationAuthorizedOn === '2026-08-15'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publishedImplementation === ''
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publishedApprovalRecord === ''
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.initialPublishedHandoff === ''
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publicationState === 'approved-not-published'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.nextGate.includes('7a00ef8691da6df2821cf3ad02437198d0d9f2e6')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.nextGate.includes('approval record')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.nextGate.includes('next enemy gate remains closed'),
  'Ironhalo approval record or publication boundary drifted',
);
check(
  EN_E12_BASILISK_IRONHALO_TYRANT_GATE.authorizationEvidence.includes('approved letsd do next')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.authorizationEvidence.includes('exactly one private elite Basilisk full 80-frame candidate')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.authorizationEvidence.includes('names only Ironhalo Tyrant')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.authorizationEvidence.includes('does not approve candidate pixels'),
  'Ironhalo authorization evidence drifted',
);
check(
  JSON.stringify(EN_E12_BASILISK_ELITE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E12_BASILISK_ELITE_CONTRACT_CARD.precedingGate === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id
    && EN_E12_BASILISK_ELITE_CONTRACT_CARD.activeVariant.id === 'ironhalo-tyrant'
    && EN_E12_BASILISK_ELITE_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E12_BASILISK_ELITE_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E12_BASILISK_ELITE_CONTRACT_CARD.deferredRoles.length === 0
    && EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT.state === 'implemented-complete-motion-approved',
  'Basilisk elite role contract drifted',
);
check(
  EN_E12_BASILISK_IRONHALO_TYRANT_DATA.actorTopology === EN_E12_BASILISK_TOPOLOGY_DECISION.selected
    && EN_E12_BASILISK_IRONHALO_TYRANT_DATA.childAssets.length === 0
    && EN_E12_BASILISK_IRONHALO_TYRANT_DATA.bakedEffects.length === 0
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.animationContract.includes('braces all four claws')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.animationContract.includes('body-owned crushing press')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.animationContract.includes('instead of translating one rigid rectangle')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.animationContract.includes('four distinct pillar-claw bend phases')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.exclusions.includes('registration')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.exclusions.includes('outline registration')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.exclusions.includes('fixtures')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.exclusions.includes('Manticore or Sphinx')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.nextGate.includes('next enemy gate remains closed')
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.nextGate.includes('outline registration'),
  'Ironhalo anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E12_BASILISK_ELITE_CONTRACT_CARD)
    && Object.isFrozen(EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT)
    && Object.isFrozen(EN_E12_BASILISK_IRONHALO_TYRANT_DATA)
    && Object.isFrozen(EN_E12_BASILISK_IRONHALO_TYRANT_GATE),
  'Ironhalo contracts, data, and gate must be deeply immutable',
);
check(
  EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY.families.length === 1
    && EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY.publicFamilies.length === 0
    && EN_E12_BASILISK_IRONHALO_TYRANT_FAMILY.variants.length === 1,
  'private elite Basilisk registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 100 && publicVariantCount === 316, 'approved private elite must preserve the integrated public 100/316 catalog');
check(!engine.PUBLIC_ENEMIES.some(({ id }) => id === 'basilisk'), 'approved private elite must keep Basilisk private');
check(engine.EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY === undefined, 'approved private elite must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const backlogSource = await readFile(path.join(root, 'engine', 'enemy-expansion-approved-backlog-v3.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
const candidateSource = await readFile(path.join(root, 'engine', 'enemy-expansion-en-e12-basilisk-ironhalo-tyrant.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [backlogSource, 'approved V3 backlog'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('ironhalo-tyrant'), label + ' must not mention Ironhalo Tyrant');
check(
  !candidateSource.includes('EN_E12_BASILISK_CROWNSCALE_CRAWLER_RENDERER')
    && !candidateSource.includes('EN_E12_BASILISK_MIRRORCREST_MESMER_RENDERER')
    && !candidateSource.includes('drawLegacySprite')
    && !candidateSource.includes('createPaletteMappedContext')
    && candidateSource.includes('function drawBasiliskIronhaloTyrantAnatomy('),
  'Ironhalo renderer must use bespoke Basilisk geometry rather than rendering or palette-mapping a comparator',
);
check(JSON.stringify(EN_E12_BASILISK_IRONHALO_TYRANT_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], crownscale: [], mirrorcrest: [], marshCrocodile: [] };
const colors = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
const palettes = [
  ['hide', new Set(colors.hide)], ['plate', new Set(colors.plate)], ['belly', new Set(colors.belly)],
  ['crown', new Set(colors.crown)], ['claw', new Set(colors.claw)], ['scale', new Set(colors.scale)],
];
const allowedActorColors = new Set(Object.values(colors).flatMap((value) => Array.isArray(value) ? value : [value]));
let connected = 0, bounded = 0, grounded = 0, fourFootRows = 0, eliteSpans = 0, sideFortressSpans = 0;
let colored = 0, flashes = 0, eyeViews = 0, jawViews = 0, fangViews = 0, crownViews = 0, plateViews = 0, clawViews = 0, scaleViews = 0;
let gateRiseViews = 0, crushingPressViews = 0, minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { crownscale: 0, mirrorcrest: 0, marshCrocodile: 0 };
const alphaDifferences = { crownscale: 0, mirrorcrest: 0, marshCrocodile: 0 };
const alphaStats = {
  crownscale: { minDistance: Infinity, maxIou: 0 },
  mirrorcrest: { minDistance: Infinity, maxIou: 0 },
  marshCrocodile: { minDistance: Infinity, maxIou: 0 },
};

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY, specs.candidate, direction, animation.id, frame);
    const crownscale = captureEnemyExpansionFrame(EN_E12_BASILISK_CROWNSCALE_CRAWLER_REGISTRY, specs.crownscale, direction, animation.id, frame);
    const mirrorcrest = captureEnemyExpansionFrame(EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY, specs.mirrorcrest, direction, animation.id, frame);
    const marshCrocodile = captureLegacyFrame(specs.marshCrocodile, direction, animation.id, frame);
    const compared = { crownscale, mirrorcrest, marshCrocodile };
    captures.set(captureKey, candidate); animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame, true));
    records.crownscale.push(frameRecord(crownscale, specs.crownscale, direction, animation.id, frame, true));
    records.mirrorcrest.push(frameRecord(mirrorcrest, specs.mirrorcrest, direction, animation.id, frame, true));
    records.marshCrocodile.push(frameRecord(marshCrocodile, specs.marshCrocodile, direction, animation.id, frame));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost claw ground contact');
    check(candidate.opaquePixels >= 300 && candidate.opaquePixels <= 390, captureKey + ' density is implausible for a broad elite Basilisk');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (rowRuns(candidate.pixels, 22) === 4) fourFootRows++; else check(false, captureKey + ' lost exactly four separately grounded iron-claw runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    if (width >= 21 && height >= 21) eliteSpans++; else check(false, captureKey + ' lost the elite fortress span at ' + width + 'x' + height);
    if (direction === 'left' || direction === 'right') {
      if (width === 22) sideFortressSpans++; else check(false, captureKey + ' lost the full broad side silhouette');
    }

    for (const [name, comparison] of Object.entries(compared)) {
      if (candidate.digest !== comparison.digest) differences[name]++;
      if (candidate.alphaDigest !== comparison.alphaDigest) alphaDifferences[name]++;
      const distance = alphaDistance(candidate.pixels, comparison.pixels);
      const iou = alphaIntersectionOverUnion(candidate.pixels, comparison.pixels);
      alphaStats[name].minDistance = Math.min(alphaStats[name].minDistance, distance);
      alphaStats[name].maxIou = Math.max(alphaStats[name].maxIou, iou);
      check(distance >= 80 && iou <= 0.78, `${captureKey} is too close to ${name} in black shape: alpha distance ${distance}, IoU ${iou.toFixed(3)}`);
    }

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const frameColors = new Set(candidate.pixels.filter(Boolean));
      check(frameColors.size === 1 && frameColors.has('#f4f4f4'), captureKey + ' must be an exact whole-silhouette #f4f4f4 flash');
      flashes++;
    } else {
      check(candidate.pixels.every((color) => color === null || allowedActorColors.has(color)), captureKey + ' contains a color outside the Ironhalo actor palette');
      for (const [name, palette] of palettes) {
        if (direction === 'up' && name === 'belly') continue;
        check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      }
      check(countColors(candidate.pixels, new Set(colors.claw)) >= 45, captureKey + ' lost four massive iron-claw contacts');
      check(countColors(candidate.pixels, new Set(colors.crown)) >= 40, captureKey + ' lost the connected antique-gold ironhalo');
      check(countColors(candidate.pixels, new Set(colors.plate)) >= 30, captureKey + ' lost fortress plating');
      check(countColors(candidate.pixels, new Set(colors.scale)) >= 4, captureKey + ' lost elite scale marks');
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
        check(eyeCount === 2 && featureCount === 2, captureKey + ' front view must preserve paired acid-green eyes and face features');
        check(jawCount > 0 && fangCount === 2, captureKey + ' front view must preserve the armored jaw and two old-bone fangs');
        eyeViews++; jawViews++; fangViews++;
      } else {
        check(eyeCount === 1 && featureCount === 1, captureKey + ' side view must preserve one acid-green profile eye and face feature');
        check(jawCount > 0 && fangCount === 1, captureKey + ' side view must preserve the armored jaw and one profile fang');
        eyeViews++; jawViews++; fangViews++;
      }
      if ((animation.id === 'attack' || animation.id === 'cast') && frame === 1) {
        check(candidate.bounds.minY === 1 && candidate.renderResult.renderedAnimation === 'attack' && candidate.renderResult.renderedFrame === 1, captureKey + ' must preserve the connected high crown-gate rise');
        gateRiseViews++;
      }
      if ((animation.id === 'attack' || animation.id === 'cast') && frame === 2) {
        check(candidate.renderResult.renderedAnimation === 'attack' && candidate.renderResult.renderedFrame === 2, captureKey + ' must preserve the body-owned crushing press');
        crushingPressViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.basiliskIronhaloTyrantGate === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.id
        && candidate.renderResult.architectureDecision === EN_E12_BASILISK_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E12_BASILISK_IRONHALO_TYRANT_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E12_BASILISK_IRONHALO_TYRANT_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const articulation = {
  idle: { whole: Infinity, crown: Infinity, legs: Infinity },
  walk: { whole: Infinity, crown: Infinity, legs: Infinity },
  attack: { whole: Infinity },
};
for (const direction of directions) {
  const idleF1 = captures.get(direction + '/idle/0').pixels;
  const idleF2 = captures.get(direction + '/idle/1').pixels;
  const idleWhole = alphaDistance(idleF1, idleF2);
  const idleCrown = regionalAlphaDistance(idleF1, idleF2, { maxY: 10 });
  const idleLegs = regionalAlphaDistance(idleF1, idleF2, { minY: 15 });
  articulation.idle.whole = Math.min(articulation.idle.whole, idleWhole);
  articulation.idle.crown = Math.min(articulation.idle.crown, idleCrown);
  articulation.idle.legs = Math.min(articulation.idle.legs, idleLegs);
  check(idleWhole >= 50 && idleCrown >= 35 && idleLegs >= 15, direction + ' Idle must articulate crown, body, legs, and tail instead of shifting one rigid square');

  const walk = [0, 1, 2, 3].map((frame) => captures.get(direction + '/walk/' + frame).pixels);
  for (let frame = 0; frame < walk.length; frame++) {
    const next = (frame + 1) % walk.length;
    const walkWhole = alphaDistance(walk[frame], walk[next]);
    const walkCrown = regionalAlphaDistance(walk[frame], walk[next], { maxY: 10 });
    const walkLegs = regionalAlphaDistance(walk[frame], walk[next], { minY: 15 });
    articulation.walk.whole = Math.min(articulation.walk.whole, walkWhole);
    articulation.walk.crown = Math.min(articulation.walk.crown, walkCrown);
    articulation.walk.legs = Math.min(articulation.walk.legs, walkLegs);
    check(walkWhole >= 50 && walkCrown >= 30 && walkLegs >= 15, direction + ' Walk W' + (frame + 1) + '-W' + (next + 1) + ' lost articulated crown, torso, or pillar-leg motion');
  }

  const attack = [0, 1, 2, 3].map((frame) => captures.get(direction + '/attack/' + frame).pixels);
  for (let frame = 0; frame < attack.length - 1; frame++) {
    const attackWhole = alphaDistance(attack[frame], attack[frame + 1]);
    articulation.attack.whole = Math.min(articulation.attack.whole, attackWhole);
    check(attackWhole >= 35, direction + ' Attack A' + (frame + 1) + '-A' + (frame + 2) + ' lost the brace-rise-crush-recoil silhouette progression');
  }
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E12_BASILISK_IRONHALO_TYRANT_GATE.candidateFrameDigest) check(digests.candidate === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.candidateFrameDigest, 'candidate digest drifted');
check(digests.crownscale === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.crownscaleComparisonDigest, 'Crownscale comparison digest drifted');
check(digests.mirrorcrest === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.mirrorcrestComparisonDigest, 'Mirrorcrest comparison digest drifted');
check(digests.marshCrocodile === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.marshCrocodileComparisonDigest, 'Marsh Crocodile comparison digest drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Ironhalo frames must be connected, bounded, and grounded');
check(fourFootRows === 80 && eliteSpans === 80 && sideFortressSpans === 40, 'all 80 frames must preserve four claw contacts and the elite span, including all 40 broad side views');
check(colored === 72 && flashes === 8 && eyeViews === 54 && jawViews === 54 && fangViews === 54 && crownViews === 72 && plateViews === 72 && clawViews === 72 && scaleViews === 72 && gateRiseViews === 8 && crushingPressViews === 8, 'colored, flash, face, crown, plate, claw, scale, gate-rise, or crushing-press totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Ironhalo Tyrant must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E12_BASILISK_IRONHALO_TYRANT_GATE.artifact],
  ['outlinedArtifactSha256', EN_E12_BASILISK_IRONHALO_TYRANT_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E12_BASILISK_IRONHALO_TYRANT_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E12_BASILISK_IRONHALO_TYRANT_GATE.comparisonArtifact],
]) if (EN_E12_BASILISK_IRONHALO_TYRANT_GATE[field]) check(await fileHash(relative) === EN_E12_BASILISK_IRONHALO_TYRANT_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E12_BASILISK_IRONHALO_TYRANT_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY, { ...specs.candidate, family: 'naga' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY, { ...specs.candidate, variant: 'manticore' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E12 Basilisk Ironhalo Tyrant focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E12 Basilisk Ironhalo Tyrant approved private elite passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Basilisk identity: ' + fourFootRows + '/80 four-claw ground rows; ' + eliteSpans + '/80 elite fortress spans; ' + sideFortressSpans + '/40 broad side views; ' + gateRiseViews + '/8 connected crown-gate rises; ' + crushingPressViews + '/8 body-owned crushing presses; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + crownViews + '/72 ironhalo views; ' + plateViews + '/72 fortress-plate views; ' + scaleViews + '/72 scale-marked views');
  console.log('- Articulation: Idle minimum alpha change ' + articulation.idle.whole + ' overall / ' + articulation.idle.crown + ' crown / ' + articulation.idle.legs + ' legs; Walk cyclic minimum ' + articulation.walk.whole + ' overall / ' + articulation.walk.crown + ' crown / ' + articulation.walk.legs + ' legs; Attack transition minimum ' + articulation.attack.whole);
  console.log('- Black-shape distinction: Crownscale minimum distance ' + alphaStats.crownscale.minDistance + ', max IoU ' + alphaStats.crownscale.maxIou.toFixed(3) + '; Mirrorcrest minimum distance ' + alphaStats.mirrorcrest.minDistance + ', max IoU ' + alphaStats.mirrorcrest.maxIou.toFixed(3) + '; Marsh Crocodile minimum distance ' + alphaStats.marshCrocodile.minDistance + ', max IoU ' + alphaStats.marshCrocodile.maxIou.toFixed(3));
  console.log('- Distinction: Crownscale ' + differences.crownscale + '/80; Mirrorcrest ' + differences.mirrorcrest + '/80; Marsh Crocodile ' + differences.marshCrocodile + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: published Crownscale and Mirrorcrest exact; public Marsh Crocodile and 100/316 exact; zero child assets/effects; bounded publication only; no registration, outline registration, fixtures, package mutation, or broader EN-E12 work');
  console.log('- Approved Ironhalo frame digest: ' + digests.candidate);
  console.log('- Approved Crownscale frame digest: ' + digests.crownscale);
  console.log('- Approved Mirrorcrest frame digest: ' + digests.mirrorcrest);
  console.log('- Public Marsh Crocodile frame digest: ' + digests.marshCrocodile);
}
