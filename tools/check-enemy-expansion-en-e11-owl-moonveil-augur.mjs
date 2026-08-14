import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT,
  EN_E11_OWL_HUSHMASK_PROWLER_GATE,
  EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY,
  EN_E11_OWL_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e11-owl-hushmask-prowler.js';
import {
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-raven-mournglass-scrier.js';
import {
  EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT,
  EN_E11_OWL_MOONVEIL_AUGUR_DATA,
  EN_E11_OWL_MOONVEIL_AUGUR_DEATH_SOURCE_FRAMES,
  EN_E11_OWL_MOONVEIL_AUGUR_FAMILY,
  EN_E11_OWL_MOONVEIL_AUGUR_GATE,
  EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY,
  EN_E11_OWL_SPECIALIST_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e11-owl-moonveil-augur.js';
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
  candidate: { kind: 'enemy', family: 'owl', variant: 'moonveil-augur' },
  hushmask: { kind: 'enemy', family: 'owl', variant: 'hushmask-prowler' },
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
  EN_E11_OWL_HUSHMASK_PROWLER_GATE.status === 'approved'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.publicationState === 'published'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.candidateFrameDigest === 'c035b53021e4281378d2a43ff9e0d909fa750d4c877837517ed3c2a42beb445a'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.publishedImplementation === 'e0fd0560ec93d12959d06cd30b593c82be74ffbd'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.publishedApprovalRecord === '0e2dbbc6f519c1e135a57686ab1e0600d0327239'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.initialPublishedHandoff === 'afa265a17feca93d2bd1c49cc844c3259e751d04',
  'published Hushmask predecessor tuple drifted',
);
check(
  EN_E11_OWL_MOONVEIL_AUGUR_GATE.status === 'approved'
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.baseCheckpoint === '0d4aff05c0ace01be69ddc2ebf8efcf79abcd394'
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.architectureDecision === EN_E11_OWL_TOPOLOGY_DECISION.id
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.authorizationEvidence.includes("Let's do next")
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.authorizationEvidence.includes('exactly one private specialist Owl full 80-frame candidate')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.authorizationEvidence.includes('role was not pre-named')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.authorizationEvidence.includes('does not approve candidate pixels'),
  'Moonveil candidate authorization drifted',
);
check(
  EN_E11_OWL_MOONVEIL_AUGUR_GATE.approvedOn === '2026-08-14'
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.approvalEvidence.includes('The designer replied: Approved')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.approvalEvidence.includes('86dbba1f850c9411f8d25949f4284874eb594711f4aa8c2c09f75172b2a2addd')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.approvalEvidence.includes('six frozen review hashes')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.approvedImplementation === 'e3544a7c08195d67d7bfac4a4f531bc53c0a1981'
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.publicationAuthorizedOn === '2026-08-14'
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.publishedImplementation === 'e3544a7c08195d67d7bfac4a4f531bc53c0a1981'
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.publishedApprovalRecord === 'c384f07ace77822b12b1daa54b3fc6ca8ef11209'
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.initialPublishedHandoff === '5dd51c5bdd386ecf4648cae3cc722fcd3ea8cc90'
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.publicationState === 'published'
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.nextGate.includes('e3544a7c08195d67d7bfac4a4f531bc53c0a1981')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.nextGate.includes('c384f07ace77822b12b1daa54b3fc6ca8ef11209')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.nextGate.includes('5dd51c5bdd386ecf4648cae3cc722fcd3ea8cc90')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.nextGate.includes('completes the bounded Owl specialist publication tuple')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.nextGate.includes('No continuation request')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.nextGate.includes('outline registration'),
  'Moonveil approval record or publication boundary drifted',
);
check(
  EN_E11_OWL_MOONVEIL_AUGUR_GATE.precedingApproval.gateId === EN_E11_OWL_HUSHMASK_PROWLER_GATE.id
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.precedingApproval.candidateFrameDigest === EN_E11_OWL_HUSHMASK_PROWLER_GATE.candidateFrameDigest
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.precedingApproval.publishedImplementation === EN_E11_OWL_HUSHMASK_PROWLER_GATE.publishedImplementation
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.precedingApproval.publishedApprovalRecord === EN_E11_OWL_HUSHMASK_PROWLER_GATE.publishedApprovalRecord
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.precedingApproval.initialPublishedHandoff === EN_E11_OWL_HUSHMASK_PROWLER_GATE.initialPublishedHandoff
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.precedingApproval.currentReconciliation === EN_E11_OWL_MOONVEIL_AUGUR_GATE.baseCheckpoint,
  'Moonveil predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E11_OWL_SPECIALIST_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E11_OWL_SPECIALIST_CONTRACT_CARD.precedingVariant.id === 'hushmask-prowler'
    && EN_E11_OWL_SPECIALIST_CONTRACT_CARD.precedingVariant.role === 'common'
    && EN_E11_OWL_SPECIALIST_CONTRACT_CARD.activeVariant.id === 'moonveil-augur'
    && EN_E11_OWL_SPECIALIST_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E11_OWL_SPECIALIST_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved-published-reconciled'
    && JSON.stringify(EN_E11_OWL_SPECIALIST_CONTRACT_CARD.deferredRoles) === JSON.stringify(['elite'])
    && EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.state === 'implemented-complete-motion-approved',
  'Owl specialist role contract drifted',
);
check(
  EN_E11_OWL_MOONVEIL_AUGUR_DATA.actorTopology === EN_E11_OWL_TOPOLOGY_DECISION.selected
    && EN_E11_OWL_MOONVEIL_AUGUR_DATA.childAssets.length === 0
    && EN_E11_OWL_MOONVEIL_AUGUR_DATA.bakedEffects.length === 0
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.animationContract.includes('asymmetrical moon-screen')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.exclusions.includes('registration')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.exclusions.includes('fixtures')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.exclusions.includes('Owl elite')
    && EN_E11_OWL_MOONVEIL_AUGUR_GATE.exclusions.includes('Phoenix'),
  'Moonveil anatomy, motion, effect firewall, or scope boundary drifted',
);
check(
  Object.isFrozen(EN_E11_OWL_SPECIALIST_CONTRACT_CARD)
    && Object.isFrozen(EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT)
    && Object.isFrozen(EN_E11_OWL_MOONVEIL_AUGUR_DATA)
    && Object.isFrozen(EN_E11_OWL_MOONVEIL_AUGUR_GATE),
  'Moonveil contracts, data, and gate must be deeply immutable',
);
check(
  EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY.families.length === 1
    && EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY.publicFamilies.length === 0
    && EN_E11_OWL_MOONVEIL_AUGUR_FAMILY.variants.length === 1,
  'private Moonveil registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 100 && publicVariantCount === 316 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'owl'), 'candidate must preserve public 100/316 and keep Owl private');
check(engine.EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const backlogSource = await readFile(path.join(root, 'engine', 'enemy-expansion-approved-backlog-v3.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [backlogSource, 'approved backlog'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('moonveil-augur'), label + ' must not mention Moonveil Augur');
check(JSON.stringify(EN_E11_OWL_MOONVEIL_AUGUR_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], hushmask: [], mournglass: [], harpy: [] };
const colors = EN_E11_OWL_MOONVEIL_AUGUR_DATA.owl;
const palettes = [
  ['head', new Set(colors.head)], ['body', new Set(colors.body)], ['wing', new Set(colors.wing)],
  ['disk', new Set(colors.disk)], ['tail', new Set(colors.tail)], ['moon', new Set(colors.moon)],
  ['sigil', new Set(colors.sigil)], ['talon', new Set(colors.talon)],
];
let connected = 0, bounded = 0, grounded = 0, twoFootRows = 0, roundOwlSpans = 0, browPlumeViews = 0, moonScreenViews = 0;
let colored = 0, flashes = 0, eyeViews = 0, beakViews = 0, headViews = 0, facialDiskViews = 0, diskViews = 0, moonViews = 0, sigilViews = 0, tailViews = 0, wingViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { hushmask: 0, mournglass: 0, harpy: 0 };
const alphaDifferences = { hushmask: 0, mournglass: 0, harpy: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY, specs.candidate, direction, animation.id, frame);
    const hushmask = captureEnemyExpansionFrame(EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY, specs.hushmask, direction, animation.id, frame);
    const mournglass = captureEnemyExpansionFrame(EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY, specs.mournglass, direction, animation.id, frame);
    const harpy = captureLegacyFrame(specs.harpy, direction, animation.id, frame);
    const compared = { hushmask, mournglass, harpy };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.hushmask.push(frameRecord(hushmask, specs.hushmask, direction, animation.id, frame));
    records.mournglass.push(frameRecord(mournglass, specs.mournglass, direction, animation.id, frame));
    records.harpy.push(frameRecord(harpy, specs.harpy, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost talon ground contact');
    check(candidate.opaquePixels >= 170 && candidate.opaquePixels <= 400, captureKey + ' density is implausible for a mantled specialist Owl');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 2) twoFootRows++; else check(false, captureKey + ' lost exactly two separated grounded three-toed foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const roundOwlSpan = (direction === 'left' || direction === 'right') ? width >= 17 && height >= 21 : width >= 14 && height >= 21;
    if (roundOwlSpan) roundOwlSpans++; else check(false, captureKey + ' lost the compact mantled Owl span at ' + width + 'x' + height);
    if (candidate.bounds.minY < hushmask.bounds.minY) browPlumeViews++; else check(false, captureKey + ' lost the connected swept brow-plume silhouette');

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
      for (const [name, palette] of palettes) check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      check(countColors(candidate.pixels, new Set(colors.talon)) >= 8, captureKey + ' lost two broad talon contacts');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      const beakCount = countColors(candidate.pixels, new Set(colors.beak));
      if (countColors(candidate.pixels, new Set(colors.head)) >= 12) headViews++;
      const diskCount = countColors(candidate.pixels, new Set(colors.disk));
      if (diskCount > 0) diskViews++;
      if (direction !== 'up' && diskCount >= 20) facialDiskViews++;
      if (countColors(candidate.pixels, new Set(colors.moon)) > 0) moonViews++;
      if (countColors(candidate.pixels, new Set(colors.sigil)) > 0) sigilViews++;
      if (countColors(candidate.pixels, new Set(colors.tail)) > 0) tailViews++;
      if (countColors(candidate.pixels, new Set(colors.wing)) > 0) wingViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && beakCount === 0, captureKey + ' rear view must not expose eye, face, or beak pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired cool-teal eyes');
        check(featureCount === 2, captureKey + ' front view must preserve paired compact face features');
        check(beakCount >= 7, captureKey + ' front view must preserve the small steel hooked beak');
        eyeViews++; beakViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one cool-teal profile eye');
        check(featureCount === 1, captureKey + ' side view must preserve one compact profile feature');
        check(beakCount >= 6, captureKey + ' side view must preserve the small steel profile beak');
        eyeViews++; beakViews++;
      }
      const moonScreen = (animation.id === 'attack' || animation.id === 'cast') && (frame === 1 || frame === 2);
      if (moonScreen) {
        check(countColors(candidate.pixels, new Set([...colors.wing, ...colors.moon])) >= 45, captureKey + ' moon-screen must preserve a broad wing-and-mantle read');
        const minimumWidth = (direction === 'left' || direction === 'right') ? 20 : 22;
        check(width >= minimumWidth, captureKey + ' moon-screen must produce a broad body-owned silhouette');
        moonScreenViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.owlMoonveilAugurGate === EN_E11_OWL_MOONVEIL_AUGUR_GATE.id
        && candidate.renderResult.architectureDecision === EN_E11_OWL_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E11_OWL_HUSHMASK_PROWLER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E11_OWL_MOONVEIL_AUGUR_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E11_OWL_MOONVEIL_AUGUR_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E11_OWL_MOONVEIL_AUGUR_GATE.candidateFrameDigest) check(digests.candidate === EN_E11_OWL_MOONVEIL_AUGUR_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E11_OWL_MOONVEIL_AUGUR_GATE.hushmaskComparisonDigest) check(digests.hushmask === EN_E11_OWL_MOONVEIL_AUGUR_GATE.hushmaskComparisonDigest, 'Hushmask comparison digest drifted');
if (EN_E11_OWL_MOONVEIL_AUGUR_GATE.mournglassComparisonDigest) check(digests.mournglass === EN_E11_OWL_MOONVEIL_AUGUR_GATE.mournglassComparisonDigest, 'Mournglass comparison digest drifted');
if (EN_E11_OWL_MOONVEIL_AUGUR_GATE.harpyComparisonDigest) check(digests.harpy === EN_E11_OWL_MOONVEIL_AUGUR_GATE.harpyComparisonDigest, 'Harpy comparison digest drifted');
check(digests.hushmask === EN_E11_OWL_HUSHMASK_PROWLER_GATE.candidateFrameDigest, 'approved Hushmask comparison source drifted');
check(digests.mournglass === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.candidateFrameDigest, 'approved Mournglass comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Moonveil frames must be connected, bounded, and grounded');
check(twoFootRows === 80 && roundOwlSpans === 80 && browPlumeViews === 80, 'all 80 frames must preserve two talon contacts, the compact Owl span, and connected brow plumes');
check(colored === 72 && flashes === 8 && eyeViews === 54 && beakViews === 54 && headViews === 72 && facialDiskViews === 54 && diskViews === 72 && moonViews === 72 && sigilViews === 72 && tailViews === 72 && wingViews === 72 && moonScreenViews === 16, 'colored, flash, eye, beak, head, disk, moon, sigil, tail, wing, or moon-screen totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Moonveil Augur must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E11_OWL_MOONVEIL_AUGUR_GATE.artifact],
  ['outlinedArtifactSha256', EN_E11_OWL_MOONVEIL_AUGUR_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E11_OWL_MOONVEIL_AUGUR_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E11_OWL_MOONVEIL_AUGUR_GATE.comparisonArtifact],
]) if (EN_E11_OWL_MOONVEIL_AUGUR_GATE[field]) check(await fileHash(relative) === EN_E11_OWL_MOONVEIL_AUGUR_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E11_OWL_MOONVEIL_AUGUR_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY, { ...specs.candidate, family: 'birdfolk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY, { ...specs.candidate, variant: 'phoenix' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E11 Owl Moonveil Augur focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E11 Owl Moonveil Augur approved private specialist passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Owl identity: ' + twoFootRows + '/80 two three-toed talon rows; ' + roundOwlSpans + '/80 compact mantled Owl spans; ' + browPlumeViews + '/80 connected brow-plume silhouettes; ' + moonScreenViews + '/16 asymmetrical moon-screen views; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + headViews + '/72 head views; ' + facialDiskViews + '/54 facial-disk views; ' + moonViews + '/72 moon-silver views; ' + sigilViews + '/72 teal-mark views; ' + tailViews + '/72 short fan-tail views; ' + wingViews + '/72 wing views');
  console.log('- Distinction: Hushmask ' + differences.hushmask + '/80; Mournglass ' + differences.mournglass + '/80; Harpy ' + differences.harpy + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Hushmask and Mournglass exact; public Harpy and 100/316 exact; zero child assets/effects; no registration, outline registration, or fixtures');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Hushmask frame digest: ' + digests.hushmask);
  console.log('- Approved Mournglass frame digest: ' + digests.mournglass);
  console.log('- Public Harpy frame digest: ' + digests.harpy);
}
