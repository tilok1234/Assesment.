import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E12_BASILISK_IRONHALO_TYRANT_GATE,
  EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY,
} from '../engine/enemy-expansion-en-e12-basilisk-ironhalo-tyrant.js';
import {
  EN_E12_MANTICORE_COMMON_CONTRACT_CARD,
  EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT,
  EN_E12_MANTICORE_THORNMANE_STALKER_DATA,
  EN_E12_MANTICORE_THORNMANE_STALKER_DEATH_SOURCE_FRAMES,
  EN_E12_MANTICORE_THORNMANE_STALKER_FAMILY,
  EN_E12_MANTICORE_THORNMANE_STALKER_GATE,
  EN_E12_MANTICORE_THORNMANE_STALKER_REGISTRY,
  EN_E12_MANTICORE_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e12-manticore-thornmane-stalker.js';
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
  candidate: { kind: 'enemy', family: 'manticore', variant: 'thornmane-stalker' },
  ironhalo: { kind: 'enemy', family: 'basilisk', variant: 'ironhalo-tyrant' },
  tiger: { kind: 'enemy', family: 'bigcat', variant: 'tiger' },
  emperorScorpion: { kind: 'enemy', family: 'scorpion', variant: 'emperor' },
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
  EN_E12_BASILISK_IRONHALO_TYRANT_GATE.status === 'approved'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publicationState === 'published'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.candidateFrameDigest === 'ea00f445e8f807098b6392cd3cf81fedbf0a29d6eb96434495ab5af9b3308a6f'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publishedImplementation === '7a00ef8691da6df2821cf3ad02437198d0d9f2e6'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publishedApprovalRecord === '16f797813361c61f0bcda2933ecb86d03b0d66cc'
    && EN_E12_BASILISK_IRONHALO_TYRANT_GATE.initialPublishedHandoff === 'f0d4b503162703b88213372e1e2831162d1a9ccf',
  'published Ironhalo predecessor tuple drifted',
);
check(
  EN_E12_MANTICORE_TOPOLOGY_DECISION.status === 'approved'
    && EN_E12_MANTICORE_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-mane-faced-scorpion-tailed-quadruped'
    && EN_E12_MANTICORE_TOPOLOGY_DECISION.approvedOn === '2026-08-15'
    && EN_E12_MANTICORE_TOPOLOGY_DECISION.approvalEvidence.includes('the designer replied lets do next')
    && EN_E12_MANTICORE_TOPOLOGY_DECISION.approvalEvidence.includes('The designer replied approved')
    && EN_E12_MANTICORE_TOPOLOGY_DECISION.approvalEvidence.includes('exactly one private common Manticore full 80-frame candidate')
    && EN_E12_MANTICORE_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Manticore topology decision drifted',
);
check(
  EN_E12_MANTICORE_THORNMANE_STALKER_GATE.status === 'approved'
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.baseCheckpoint === 'b0f17a8c780b22b8535ae48ad4c739e73d1f667d'
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.architectureDecision === EN_E12_MANTICORE_TOPOLOGY_DECISION.id
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.precedingApproval.gateId === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.id
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.precedingApproval.candidateFrameDigest === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.candidateFrameDigest
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.precedingApproval.publishedImplementation === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publishedImplementation
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.precedingApproval.publishedApprovalRecord === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publishedApprovalRecord
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.precedingApproval.initialPublishedHandoff === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.initialPublishedHandoff
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.precedingApproval.currentReconciliation === EN_E12_MANTICORE_THORNMANE_STALKER_GATE.baseCheckpoint,
  'Thornmane approved gate identity or predecessor tuple drifted',
);
check(
  EN_E12_MANTICORE_THORNMANE_STALKER_GATE.approvedOn === '2026-08-15'
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.approvalEvidence.includes('The designer replied: approved')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.approvalEvidence.includes('734d1a7f43bd39399fdb8f81011ca065f931804ee1207ff82fc72784768342f9')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.approvalEvidence.includes('six frozen review hashes')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.approvalEvidence.includes('no continuation request')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.approvedImplementation === 'a2bb4a00d2e4fda941f781efce6e82df3a66e9b2'
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.publicationAuthorizedOn === '2026-08-15'
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.publishedImplementation === 'a2bb4a00d2e4fda941f781efce6e82df3a66e9b2'
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.publishedApprovalRecord === '1551a82ff386f61f91da98a9069618f98fbb3cca'
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.initialPublishedHandoff === 'e12959be67b8894aeba26c305eaf3555f4309bb5'
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.publicationState === 'published'
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.nextGate.includes('a2bb4a00d2e4fda941f781efce6e82df3a66e9b2')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.nextGate.includes('1551a82ff386f61f91da98a9069618f98fbb3cca')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.nextGate.includes('e12959be67b8894aeba26c305eaf3555f4309bb5')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.nextGate.includes('completes the bounded Manticore common publication tuple')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.nextGate.includes('no next enemy role or family is open'),
  'Thornmane approval record or publication boundary drifted',
);
check(
  JSON.stringify(EN_E12_MANTICORE_COMMON_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E12_MANTICORE_COMMON_CONTRACT_CARD.precedingFamily.finalVariant === 'ironhalo-tyrant'
    && EN_E12_MANTICORE_COMMON_CONTRACT_CARD.activeVariant.id === 'thornmane-stalker'
    && EN_E12_MANTICORE_COMMON_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E12_MANTICORE_COMMON_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved-published-reconciled'
    && JSON.stringify(EN_E12_MANTICORE_COMMON_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite'])
    && EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT.state === 'implemented-complete-motion-approved',
  'Manticore common role contract drifted',
);
check(
  EN_E12_MANTICORE_THORNMANE_STALKER_DATA.actorTopology === EN_E12_MANTICORE_TOPOLOGY_DECISION.selected
    && EN_E12_MANTICORE_THORNMANE_STALKER_DATA.childAssets.length === 0
    && EN_E12_MANTICORE_THORNMANE_STALKER_DATA.bakedEffects.length === 0
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.animationContract.includes('braces all four paws')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.animationContract.includes('body-owned over-back stinger thrust')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.exclusions.includes('registration')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.exclusions.includes('outline registration')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.exclusions.includes('fixtures')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.exclusions.includes('Sphinx')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.nextGate.includes('no next enemy role or family is open')
    && EN_E12_MANTICORE_THORNMANE_STALKER_GATE.nextGate.includes('outline registration'),
  'Thornmane anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E12_MANTICORE_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E12_MANTICORE_COMMON_CONTRACT_CARD)
    && Object.isFrozen(EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT)
    && Object.isFrozen(EN_E12_MANTICORE_THORNMANE_STALKER_DATA)
    && Object.isFrozen(EN_E12_MANTICORE_THORNMANE_STALKER_GATE),
  'Thornmane topology, contracts, data, and gate must be deeply immutable',
);
check(
  EN_E12_MANTICORE_THORNMANE_STALKER_REGISTRY.families.length === 1
    && EN_E12_MANTICORE_THORNMANE_STALKER_REGISTRY.publicFamilies.length === 0
    && EN_E12_MANTICORE_THORNMANE_STALKER_FAMILY.variants.length === 1,
  'private common Manticore registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 100 && publicVariantCount === 316, 'candidate must preserve the integrated public 100/316 catalog');
check(!engine.PUBLIC_ENEMIES.some(({ id }) => id === 'manticore'), 'candidate must keep Manticore private');
check(engine.EN_E12_MANTICORE_THORNMANE_STALKER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const backlogSource = await readFile(path.join(root, 'engine', 'enemy-expansion-approved-backlog-v3.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
const candidateSource = await readFile(path.join(root, 'engine', 'enemy-expansion-en-e12-manticore-thornmane-stalker.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [backlogSource, 'approved V3 backlog'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('thornmane-stalker'), label + ' must not mention Thornmane Stalker');
check(
  !candidateSource.includes('EN_E12_BASILISK_IRONHALO_TYRANT_RENDERER')
    && !candidateSource.includes("family.id === 'bigcat'")
    && !candidateSource.includes("family.id === 'scorpion'")
    && !candidateSource.includes('drawLegacySprite')
    && !candidateSource.includes('createPaletteMappedContext')
    && candidateSource.includes('function drawManticoreThornmaneStalkerAnatomy('),
  'Thornmane renderer must use bespoke Manticore geometry rather than rendering or palette-mapping a comparator',
);
check(JSON.stringify(EN_E12_MANTICORE_THORNMANE_STALKER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], ironhalo: [], tiger: [], emperorScorpion: [] };
const colors = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
const palettes = [
  ['fur', new Set(colors.fur)], ['mane', new Set(colors.mane)],
  ['tail', new Set(colors.tail)], ['stinger', new Set(colors.stinger)],
  ['paw', new Set(colors.paw)], ['mark', new Set(colors.mark)],
];
const allowedActorColors = new Set(Object.values(colors).flatMap((value) => Array.isArray(value) ? value : [value]));
let connected = 0, bounded = 0, grounded = 0, fourPawRows = 0, commonSpans = 0, sideLionSpans = 0;
let colored = 0, flashes = 0, faceViews = 0, maneViews = 0, maskViews = 0, tailViews = 0, stingerViews = 0, pawViews = 0;
let tailRiseViews = 0, stingerThrustViews = 0, minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { ironhalo: 0, tiger: 0, emperorScorpion: 0 };
const alphaDifferences = { ironhalo: 0, tiger: 0, emperorScorpion: 0 };
const alphaStats = {
  ironhalo: { minDistance: Infinity, maxIou: 0 },
  tiger: { minDistance: Infinity, maxIou: 0 },
  emperorScorpion: { minDistance: Infinity, maxIou: 0 },
};

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E12_MANTICORE_THORNMANE_STALKER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const ironhalo = captureEnemyExpansionFrame(EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY, specs.ironhalo, direction, animation.id, frame);
    const tiger = captureLegacyFrame(specs.tiger, direction, animation.id, frame);
    const emperorScorpion = captureLegacyFrame(specs.emperorScorpion, direction, animation.id, frame);
    const compared = { ironhalo, tiger, emperorScorpion };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame, true));
    records.ironhalo.push(frameRecord(ironhalo, specs.ironhalo, direction, animation.id, frame, true));
    records.tiger.push(frameRecord(tiger, specs.tiger, direction, animation.id, frame));
    records.emperorScorpion.push(frameRecord(emperorScorpion, specs.emperorScorpion, direction, animation.id, frame));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost paw ground contact');
    check(candidate.opaquePixels >= 150 && candidate.opaquePixels <= 310, captureKey + ' density is implausible for a common Manticore');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 4) fourPawRows++; else check(false, captureKey + ' lost exactly four separately grounded paw runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const isSide = direction === 'left' || direction === 'right';
    if (width >= (isSide ? 20 : 17) && height >= 18) commonSpans++; else check(false, captureKey + ' lost the common Manticore span at ' + width + 'x' + height);
    if (direction === 'left' || direction === 'right') {
      if (width >= 20) sideLionSpans++; else check(false, captureKey + ' lost the long lion-and-hooktail side silhouette');
    }

    for (const [name, comparison] of Object.entries(compared)) {
      if (candidate.digest !== comparison.digest) differences[name]++;
      if (candidate.alphaDigest !== comparison.alphaDigest) alphaDifferences[name]++;
      const distance = alphaDistance(candidate.pixels, comparison.pixels);
      const iou = alphaIntersectionOverUnion(candidate.pixels, comparison.pixels);
      alphaStats[name].minDistance = Math.min(alphaStats[name].minDistance, distance);
      alphaStats[name].maxIou = Math.max(alphaStats[name].maxIou, iou);
      check(distance >= 40 && iou <= 0.85, captureKey + ' is too close to ' + name + ' in black shape: alpha distance ' + distance + ', IoU ' + iou.toFixed(3));
    }

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const frameColors = new Set(candidate.pixels.filter(Boolean));
      check(frameColors.size === 1 && frameColors.has('#f4f4f4'), captureKey + ' must be an exact whole-silhouette #f4f4f4 flash');
      flashes++;
    } else {
      check(candidate.pixels.every((color) => color === null || allowedActorColors.has(color)), captureKey + ' contains a color outside the Thornmane actor palette');
      for (const [name, palette] of palettes) check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      const maneCount = countColors(candidate.pixels, new Set(colors.mane));
      const maskCount = countColors(candidate.pixels, new Set(colors.mask));
      const tailCount = countColors(candidate.pixels, new Set(colors.tail));
      const stingerCount = countColors(candidate.pixels, new Set(colors.stinger));
      const pawCount = countColors(candidate.pixels, new Set(colors.paw));
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const fangCount = countColors(candidate.pixels, new Set(colors.fang));
      check(maneCount >= 16, captureKey + ' lost the broad oxblood mane');
      check(tailCount >= 14 && stingerCount >= 4, captureKey + ' lost the connected segmented tail or hook stinger');
      check(pawCount >= 8, captureKey + ' lost four dark paw contacts');
      maneViews++; tailViews++; stingerViews++; pawViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && maskCount === 0 && fangCount === 0, captureKey + ' rear view must not expose eye, mask, or fang pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2 && maskCount > 0 && fangCount === 2, captureKey + ' front view must preserve paired amber eyes, mask, and two ivory fangs');
        faceViews++; maskViews++;
      } else {
        check(eyeCount === 1 && maskCount > 0 && fangCount === 1, captureKey + ' side view must preserve one amber profile eye, mask, and fang');
        faceViews++; maskViews++;
      }
      if ((animation.id === 'attack' || animation.id === 'cast') && frame === 1) {
        check(candidate.bounds.minY <= 4, captureKey + ' tail-rise phase must reach the high connected silhouette band');
        tailRiseViews++;
      }
      if ((animation.id === 'attack' || animation.id === 'cast') && frame === 2) {
        check(candidate.renderResult.renderedAnimation === 'attack' && candidate.renderResult.renderedFrame === 2, captureKey + ' must preserve the body-owned stinger-thrust phase');
        check(candidate.bounds.minY <= 4, captureKey + ' stinger thrust must remain visible above the lion body');
        stingerThrustViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.manticoreThornmaneStalkerGate === EN_E12_MANTICORE_THORNMANE_STALKER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E12_MANTICORE_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E12_MANTICORE_THORNMANE_STALKER_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E12_MANTICORE_THORNMANE_STALKER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E12_MANTICORE_THORNMANE_STALKER_GATE.candidateFrameDigest) check(digests.candidate === EN_E12_MANTICORE_THORNMANE_STALKER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E12_MANTICORE_THORNMANE_STALKER_GATE.ironhaloComparisonDigest) check(digests.ironhalo === EN_E12_MANTICORE_THORNMANE_STALKER_GATE.ironhaloComparisonDigest, 'Ironhalo comparison digest drifted');
if (EN_E12_MANTICORE_THORNMANE_STALKER_GATE.tigerComparisonDigest) check(digests.tiger === EN_E12_MANTICORE_THORNMANE_STALKER_GATE.tigerComparisonDigest, 'Tiger comparison digest drifted');
if (EN_E12_MANTICORE_THORNMANE_STALKER_GATE.emperorScorpionComparisonDigest) check(digests.emperorScorpion === EN_E12_MANTICORE_THORNMANE_STALKER_GATE.emperorScorpionComparisonDigest, 'Emperor Scorpion comparison digest drifted');
check(digests.ironhalo === EN_E12_BASILISK_IRONHALO_TYRANT_GATE.candidateFrameDigest, 'approved Ironhalo comparison source drifted');
check(digests.tiger === 'e94b68febfb6d9c6a00d6e0215b3295b243080c756c9e1a769e72ceff2ac6783', 'public Tiger comparison source drifted');
check(digests.emperorScorpion === '79aefd7497c18adb488b25cb33280e78527569ef8b8bd3e0b4ad2c2241371dc4', 'public Emperor Scorpion comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Thornmane frames must be connected, bounded, and grounded');
check(fourPawRows === 80 && commonSpans === 80 && sideLionSpans === 40, 'all 80 frames must preserve four paw contacts and the common span, including all 40 lion-and-hooktail side views');
check(colored === 72 && flashes === 8 && faceViews === 54 && maskViews === 54 && maneViews === 72 && tailViews === 72 && stingerViews === 72 && pawViews === 72 && tailRiseViews === 8 && stingerThrustViews === 8, 'colored, flash, face, mane, mask, tail, stinger, paw, tail-rise, or stinger-thrust totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Thornmane Stalker must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E12_MANTICORE_THORNMANE_STALKER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E12_MANTICORE_THORNMANE_STALKER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E12_MANTICORE_THORNMANE_STALKER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E12_MANTICORE_THORNMANE_STALKER_GATE.comparisonArtifact],
]) if (EN_E12_MANTICORE_THORNMANE_STALKER_GATE[field]) check(await fileHash(relative) === EN_E12_MANTICORE_THORNMANE_STALKER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E12_MANTICORE_THORNMANE_STALKER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E12_MANTICORE_THORNMANE_STALKER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'is invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E12_MANTICORE_THORNMANE_STALKER_REGISTRY, { ...specs.candidate, family: 'basilisk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E12_MANTICORE_THORNMANE_STALKER_REGISTRY, { ...specs.candidate, variant: 'sphinx' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E12 Manticore Thornmane Stalker focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E12 Manticore Thornmane Stalker approved private common passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Manticore identity: ' + fourPawRows + '/80 four-paw ground rows; ' + commonSpans + '/80 common spans; ' + sideLionSpans + '/40 lion-and-hooktail side views; ' + tailRiseViews + '/8 tail-rise views; ' + stingerThrustViews + '/8 body-owned stinger thrusts; ' + flashes + '/8 #f4f4f4 flashes; ' + faceViews + '/54 face views; ' + maneViews + '/72 mane views; ' + tailViews + '/72 segmented-tail views; ' + stingerViews + '/72 hook-stinger views');
  console.log('- Black-shape distinction: Ironhalo minimum distance ' + alphaStats.ironhalo.minDistance + ', max IoU ' + alphaStats.ironhalo.maxIou.toFixed(3) + '; Tiger minimum distance ' + alphaStats.tiger.minDistance + ', max IoU ' + alphaStats.tiger.maxIou.toFixed(3) + '; Emperor Scorpion minimum distance ' + alphaStats.emperorScorpion.minDistance + ', max IoU ' + alphaStats.emperorScorpion.maxIou.toFixed(3));
  console.log('- Distinction: Ironhalo ' + differences.ironhalo + '/80; Tiger ' + differences.tiger + '/80; Emperor Scorpion ' + differences.emperorScorpion + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: published Ironhalo exact; public Tiger, Emperor Scorpion, and 100/316 exact; zero child assets/effects; no public or outline registration, fixtures, package mutation, continuation, or broader EN-E12 work');
  console.log('- Approved Thornmane frame digest: ' + digests.candidate);
  console.log('- Approved Ironhalo frame digest: ' + digests.ironhalo);
  console.log('- Public Tiger frame digest: ' + digests.tiger);
  console.log('- Public Emperor Scorpion frame digest: ' + digests.emperorScorpion);
}
