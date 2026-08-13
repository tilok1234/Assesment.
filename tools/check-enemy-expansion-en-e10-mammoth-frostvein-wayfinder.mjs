import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E10_MAMMOTH_TOPOLOGY_DECISION,
  EN_E10_TUNDRAHIDE_GRAZER_GATE,
  EN_E10_TUNDRAHIDE_GRAZER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-mammoth-tundrahide-grazer.js';
import {
  EN_E10_CLIFFCOIL_STRIDER_GATE,
  EN_E10_CLIFFCOIL_STRIDER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-ram-cliffcoil-strider.js';
import {
  EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD,
  EN_E10_FROSTVEIN_WAYFINDER_CONTRACT,
  EN_E10_FROSTVEIN_WAYFINDER_DATA,
  EN_E10_FROSTVEIN_WAYFINDER_DEATH_SOURCE_FRAMES,
  EN_E10_FROSTVEIN_WAYFINDER_FAMILY,
  EN_E10_FROSTVEIN_WAYFINDER_GATE,
  EN_E10_FROSTVEIN_WAYFINDER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-mammoth-frostvein-wayfinder.js';
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
  candidate: { kind: 'enemy', family: 'mammoth', variant: 'frostvein-wayfinder' },
  tundrahide: { kind: 'enemy', family: 'mammoth', variant: 'tundrahide-grazer' },
  cliffcoil: { kind: 'enemy', family: 'ram', variant: 'cliffcoil-strider' },
  direWolf: { kind: 'enemy', family: 'wolf', variant: 'dire' },
};

function check(condition, message) { if (!condition) errors.push(message); }
function hashJson(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
function frameRecord(captured, spec, direction, animation, frame, candidateFamily = true) {
  return { family: spec.family, variant: spec.variant, ...(candidateFamily ? { candidateFamily: spec.family } : {}), direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds };
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
    minX: Math.min(...occupied.map(({ x }) => x)), minY: Math.min(...occupied.map(({ y }) => y)),
    maxX: Math.max(...occupied.map(({ x }) => x)), maxY: Math.max(...occupied.map(({ y }) => y)),
  } : null;
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
      const index = queue.shift();
      const x = index % 24;
      const y = Math.floor(index / 24);
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
  let runs = 0;
  let occupied = false;
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
  EN_E10_TUNDRAHIDE_GRAZER_GATE.status === 'approved'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.candidateFrameDigest === '740960848a5a45941a908b8f32d53a6426de789f7ca002817309e7506dcd3e08'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.publishedImplementation === 'f0ced3c777c478a4077fb439ccd8b4b363ea52ac'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.publishedApprovalRecord === '2387ec0a584f77b3473827ef0568823bf86b4fd2'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.initialPublishedHandoff === '699e17fe7749b365feabbd15f323eac15aaf4337'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.publicationState === 'published'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.nextGate.includes('private specialist Mammoth'),
  'published Tundrahide predecessor drifted',
);
check(
  EN_E10_MAMMOTH_TOPOLOGY_DECISION.status === 'selected'
    && EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected === 'baked-single-actor-tusked-heavy-grounded-quadruped'
    && EN_E10_MAMMOTH_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Mammoth topology decision drifted',
);
check(
  EN_E10_FROSTVEIN_WAYFINDER_GATE.status === 'approved'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.baseCheckpoint === '125b1b81d0f6fa977c3bf674964a45131e65f3ab'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.authorizedOn === '2026-08-13'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.authorizationEvidence.includes('designer reply awesome klets do next')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.authorizationEvidence.includes('exactly one private specialist Mammoth full 80-frame candidate')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.architectureDecision === EN_E10_MAMMOTH_TOPOLOGY_DECISION.id
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.approvedOn === '2026-08-13'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.approvalEvidence.includes('raw sprite 179')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.approvalEvidence.includes('outlined sprite 183')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.approvalEvidence.includes('Complete B + Form sprite 187')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.approvalEvidence.includes('active comparison sprite 191')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.approvalEvidence.includes('2fbcd71017d4acacb9e8cfee31d984ad9f039634af79cb656180b11a08f1250e')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.approvalEvidence.includes('designer replied: approved lets do next')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.approvedImplementation === '03618d6ca98ad1a93596bdbe501edcf1cedd466a'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.publicationAuthorizedOn === '2026-08-13'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.publishedImplementation === '03618d6ca98ad1a93596bdbe501edcf1cedd466a'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.publishedApprovalRecord === '36c43772911aa0ab81d4a417fc1ad2a29531aa30'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.initialPublishedHandoff === 'c03f2fb05746398e530ff80e2ebacbe261cc5422'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.publicationState === 'published'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.precedingApproval.gateId === EN_E10_TUNDRAHIDE_GRAZER_GATE.id
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.precedingApproval.candidateFrameDigest === EN_E10_TUNDRAHIDE_GRAZER_GATE.candidateFrameDigest
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.precedingApproval.publishedImplementation === EN_E10_TUNDRAHIDE_GRAZER_GATE.publishedImplementation
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.precedingApproval.publishedApprovalRecord === EN_E10_TUNDRAHIDE_GRAZER_GATE.publishedApprovalRecord
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.precedingApproval.initialPublishedHandoff === EN_E10_TUNDRAHIDE_GRAZER_GATE.initialPublishedHandoff
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.precedingApproval.currentReconciliation === EN_E10_FROSTVEIN_WAYFINDER_GATE.baseCheckpoint,
  'specialist Mammoth authorization or predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD.precedingVariant.id === 'tundrahide-grazer'
    && EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD.activeVariant.id === 'frostvein-wayfinder'
    && EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD.deferredRoles.join(',') === 'elite'
    && EN_E10_FROSTVEIN_WAYFINDER_CONTRACT.state === 'implemented-complete-motion-approved',
  'Mammoth specialist role or candidate contract drifted',
);
check(
  EN_E10_FROSTVEIN_WAYFINDER_DATA.actorTopology === EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected
    && EN_E10_FROSTVEIN_WAYFINDER_DATA.childAssets.length === 0
    && EN_E10_FROSTVEIN_WAYFINDER_DATA.bakedEffects.length === 0
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.animationContract.includes('lateral connected-trunk feint')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.animationContract.includes('hooked tusk sweep')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.exclusions.includes('public Mammoth registration or outline registration')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.nextGate.includes('implementation 03618d6ca98ad1a93596bdbe501edcf1cedd466a')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.nextGate.includes('approval record 36c43772911aa0ab81d4a417fc1ad2a29531aa30')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.nextGate.includes('initial published handoff c03f2fb05746398e530ff80e2ebacbe261cc5422')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.nextGate.includes('reconciliation completes the bounded publication tuple')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.nextGate.includes('private elite Mammoth full 80-frame candidate')
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.nextGate.includes('review evidence only'),
  'specialist Mammoth anatomy, effect firewall, motion, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_FROSTVEIN_WAYFINDER_CONTRACT)
    && Object.isFrozen(EN_E10_FROSTVEIN_WAYFINDER_DATA)
    && Object.isFrozen(EN_E10_FROSTVEIN_WAYFINDER_GATE),
  'specialist Mammoth contracts, data, and gate must be deeply immutable',
);
check(
  EN_E10_FROSTVEIN_WAYFINDER_REGISTRY.families.length === 1
    && EN_E10_FROSTVEIN_WAYFINDER_REGISTRY.publicFamilies.length === 0
    && EN_E10_FROSTVEIN_WAYFINDER_FAMILY.variants.length === 1,
  'private specialist Mammoth registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'mammoth'), 'candidate must preserve public 92/294 and keep Mammoth private');
check(engine.EN_E10_FROSTVEIN_WAYFINDER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
check(!publicSource.includes('frostvein-wayfinder'), 'public expansion registry must not mention Frostvein Wayfinder');
check(!manifestSource.includes('frostvein-wayfinder'), 'asset manifest must not mention Frostvein Wayfinder');
check(!outlineSource.includes('frostvein-wayfinder'), 'outline registry must not mention Frostvein Wayfinder');
check(JSON.stringify(EN_E10_FROSTVEIN_WAYFINDER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], tundrahide: [], cliffcoil: [], direWolf: [] };
const colors = EN_E10_FROSTVEIN_WAYFINDER_DATA.frostveinWayfinder;
const palettes = [
  ['wool', new Set(colors.wool)], ['face', new Set(colors.face)], ['belly', new Set(colors.belly)],
  ['mark', new Set(colors.mark)], ['ear', new Set(colors.ear)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let fourFootRows = 0;
let specialistSpans = 0;
let tuskViews = 0;
let colored = 0;
let flashes = 0;
let eyeViews = 0;
let trunkViews = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let outlinedPixels = 0;
let formChanges = 0;
const differences = { tundrahide: 0, cliffcoil: 0, direWolf: 0 };
const alphaDifferences = { tundrahide: 0, cliffcoil: 0, direWolf: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_FROSTVEIN_WAYFINDER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const tundrahide = captureEnemyExpansionFrame(EN_E10_TUNDRAHIDE_GRAZER_REGISTRY, specs.tundrahide, direction, animation.id, frame);
    const cliffcoil = captureEnemyExpansionFrame(EN_E10_CLIFFCOIL_STRIDER_REGISTRY, specs.cliffcoil, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const compared = { tundrahide, cliffcoil, direWolf };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.tundrahide.push(frameRecord(tundrahide, specs.tundrahide, direction, animation.id, frame));
    records.cliffcoil.push(frameRecord(cliffcoil, specs.cliffcoil, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost broad-foot ground contact');
    check(candidate.opaquePixels >= 165 && candidate.opaquePixels <= 350, captureKey + ' density is implausible for a specialist Mammoth');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns >= 4) fourFootRows++; else check(false, captureKey + ' lost four separated grounded broad-foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const specialistSpan = (direction === 'left' || direction === 'right') ? width >= 21 : height >= 19;
    if (specialistSpan) specialistSpans++; else check(false, captureKey + ' lost the long-tusk high-shouldered specialist span');

    for (const name of Object.keys(compared)) {
      if (candidate.digest !== compared[name].digest) differences[name]++;
      if (candidate.alphaDigest !== compared[name].alphaDigest) alphaDifferences[name]++;
    }

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const frameColors = new Set(candidate.pixels.filter(Boolean));
      check(frameColors.size === 1 && frameColors.has('#f4f4f4'), captureKey + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, palette] of palettes) check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      check(countColors(candidate.pixels, new Set([colors.foot])) >= 8, captureKey + ' lost four dark broad-foot contacts');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      const tuskCount = countColors(candidate.pixels, new Set(colors.tusk));
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && tuskCount === 0, captureKey + ' rear view must not expose face or tusk pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired cyan eyes');
        check(featureCount >= 2, captureKey + ' front view must preserve trunk-face features');
        check(tuskCount >= 14, captureKey + ' front view must preserve paired long old-ivory tusks');
        eyeViews++; trunkViews++; tuskViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one cyan profile eye');
        check(featureCount >= 1, captureKey + ' side view must preserve the trunk-face feature');
        check(tuskCount >= 8, captureKey + ' side view must preserve the long swept profile tusk');
        eyeViews++; trunkViews++; tuskViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.frostveinWayfinderGate === EN_E10_FROSTVEIN_WAYFINDER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E10_MAMMOTH_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E10_TUNDRAHIDE_GRAZER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_FROSTVEIN_WAYFINDER_DATA);
    outlinedPixels += presentation.complete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
    formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
  }
  const uniqueMotion = new Set(animationDigests).size;
  if (animation.id === 'idle' || animation.id === 'hurt' || animation.id === 'death') check(uniqueMotion === 2, direction + ' ' + animation.id + ' must preserve both authored alias phases');
  else check(uniqueMotion >= 3, direction + ' ' + animation.id + ' must preserve distinct motion phases');
}

for (const direction of directions) for (let frame = 0; frame < 4; frame++) {
  const attack = captures.get(direction + '/attack/' + frame);
  const cast = captures.get(direction + '/cast/' + frame);
  check(cast.digest === attack.digest, direction + ' Cast C' + (frame + 1) + ' must alias Attack exactly');
  const death = captures.get(direction + '/death/' + frame);
  const hurt = captures.get(direction + '/hurt/' + EN_E10_FROSTVEIN_WAYFINDER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest) check(digests.candidate === EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.tundrahideComparisonDigest) check(digests.tundrahide === EN_E10_FROSTVEIN_WAYFINDER_GATE.tundrahideComparisonDigest, 'Tundrahide comparison digest drifted');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.cliffcoilComparisonDigest) check(digests.cliffcoil === EN_E10_FROSTVEIN_WAYFINDER_GATE.cliffcoilComparisonDigest, 'Cliffcoil comparison digest drifted');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.direWolfComparisonDigest) check(digests.direWolf === EN_E10_FROSTVEIN_WAYFINDER_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
check(digests.tundrahide === EN_E10_TUNDRAHIDE_GRAZER_GATE.candidateFrameDigest, 'approved Tundrahide comparison source drifted');
check(digests.cliffcoil === EN_E10_CLIFFCOIL_STRIDER_GATE.candidateFrameDigest, 'approved Cliffcoil comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Frostvein frames must be connected, bounded, and grounded');
check(fourFootRows === 80 && specialistSpans === 80, 'all 80 frames must preserve four broad feet and the long-tusk specialist span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && trunkViews === 54 && tuskViews === 54, 'colored, flash, eye, trunk, or tusk view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Frostvein Wayfinder must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_FROSTVEIN_WAYFINDER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E10_FROSTVEIN_WAYFINDER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E10_FROSTVEIN_WAYFINDER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_FROSTVEIN_WAYFINDER_GATE.comparisonArtifact],
]) if (EN_E10_FROSTVEIN_WAYFINDER_GATE[field]) check(await fileHash(relative) === EN_E10_FROSTVEIN_WAYFINDER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E10_FROSTVEIN_WAYFINDER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E10_FROSTVEIN_WAYFINDER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_FROSTVEIN_WAYFINDER_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_FROSTVEIN_WAYFINDER_REGISTRY, { ...specs.candidate, variant: 'tundrahide-grazer' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Mammoth Frostvein Wayfinder focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Mammoth Frostvein Wayfinder private specialist candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Mammoth identity: ' + fourFootRows + '/80 four-foot rows; ' + specialistSpans + '/80 long-tusk specialist spans; ' + tuskViews + '/54 tusk views; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + trunkViews + '/54 trunk-face views');
  console.log('- Distinction: Tundrahide ' + differences.tundrahide + '/80; Cliffcoil ' + differences.cliffcoil + '/80; Dire Wolf ' + differences.direWolf + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Tundrahide and Cliffcoil exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Tundrahide frame digest: ' + digests.tundrahide);
  console.log('- Approved Cliffcoil frame digest: ' + digests.cliffcoil);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
}
