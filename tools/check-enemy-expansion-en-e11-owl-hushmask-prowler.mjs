import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-raven-cinderquill-scavenger.js';
import { EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE } from '../engine/enemy-expansion-en-e11-raven-gravecrown-harrower.js';
import {
  EN_E11_PEACOCK_RAINFAN_FORAGER_GATE,
  EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-peacock-rainfan-forager.js';
import {
  EN_E11_OWL_COMMON_CONTRACT_CARD,
  EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT,
  EN_E11_OWL_HUSHMASK_PROWLER_DATA,
  EN_E11_OWL_HUSHMASK_PROWLER_DEATH_SOURCE_FRAMES,
  EN_E11_OWL_HUSHMASK_PROWLER_FAMILY,
  EN_E11_OWL_HUSHMASK_PROWLER_GATE,
  EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY,
  EN_E11_OWL_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e11-owl-hushmask-prowler.js';
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
  candidate: { kind: 'enemy', family: 'owl', variant: 'hushmask-prowler' },
  cinderquill: { kind: 'enemy', family: 'raven', variant: 'cinderquill-scavenger' },
  rainfan: { kind: 'enemy', family: 'peacock', variant: 'rainfan-forager' },
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
  EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.status === 'approved'
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.publicationState === 'published'
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.candidateFrameDigest === '06892d2e8583a2c7ba2dc06aca12a94007230801b645db478cac187e538465d9'
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.publishedImplementation === '4d05b1f4f0ff5113bb31c4ac7011a393b6d877be'
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.publishedApprovalRecord === '8ec032c2ff90aceffeb8f8cf9533fccac89d68df'
    && EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.initialPublishedHandoff === 'e1645f03572073d00c9c9a9f96b70e9daf2d484a',
  'published Gravecrown predecessor tuple drifted',
);
check(
  EN_E11_OWL_TOPOLOGY_DECISION.status === 'selected'
    && EN_E11_OWL_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-facial-disk-owl'
    && EN_E11_OWL_TOPOLOGY_DECISION.approvedOn === '2026-08-14'
    && EN_E11_OWL_TOPOLOGY_DECISION.approvalEvidence.includes('lets do ext')
    && EN_E11_OWL_TOPOLOGY_DECISION.approvalEvidence.includes('Codex recommended baked-single-actor-grounded-facial-disk-owl')
    && EN_E11_OWL_TOPOLOGY_DECISION.approvalEvidence.includes('The designer replied: approved')
    && EN_E11_OWL_TOPOLOGY_DECISION.childAssets.length === 0
    && EN_E11_OWL_TOPOLOGY_DECISION.effectBoundary.includes('shadow wisps'),
  'approved Owl topology decision drifted',
);
check(
  EN_E11_OWL_HUSHMASK_PROWLER_GATE.status === 'approved'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.baseCheckpoint === '2d5fb020541cbe936bd7f5dba33811f7a0be03e4'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.architectureDecision === EN_E11_OWL_TOPOLOGY_DECISION.id,
  'Owl candidate gate identity or base checkpoint drifted',
);
check(
  EN_E11_OWL_HUSHMASK_PROWLER_GATE.authorizationEvidence.includes('lets do ext')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.authorizationEvidence.includes('The designer replied approved')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.authorizationEvidence.includes('exactly one private common Owl full 80-frame candidate only')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.authorizationEvidence.includes('common role was not pre-named')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.authorizationEvidence.includes('does not approve candidate pixels'),
  'Owl candidate authorization evidence drifted',
);
check(
  EN_E11_OWL_HUSHMASK_PROWLER_GATE.approvedOn === '2026-08-14'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.approvalEvidence.includes('The designer replied: approived')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.approvalEvidence.includes('c035b53021e4281378d2a43ff9e0d909fa750d4c877837517ed3c2a42beb445a')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.approvalEvidence.includes('six frozen review hashes')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.approvedImplementation === 'e0fd0560ec93d12959d06cd30b593c82be74ffbd'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.publicationAuthorizedOn === '2026-08-14'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.publishedImplementation === 'e0fd0560ec93d12959d06cd30b593c82be74ffbd'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.publishedApprovalRecord === '0e2dbbc6f519c1e135a57686ab1e0600d0327239'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.initialPublishedHandoff === ''
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.publicationState === 'published-awaiting-handoff-reconciliation'
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.nextGate.includes('e0fd0560ec93d12959d06cd30b593c82be74ffbd')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.nextGate.includes('0e2dbbc6f519c1e135a57686ab1e0600d0327239')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.nextGate.includes('initial published handoff')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.nextGate.includes('No continuation request')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.nextGate.includes('outline registration'),
  'Owl approval record or publication boundary drifted',
);
check(
  EN_E11_OWL_HUSHMASK_PROWLER_GATE.precedingApproval.gateId === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.precedingApproval.candidateFrameDigest === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.candidateFrameDigest
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.precedingApproval.publishedImplementation === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.publishedImplementation
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.precedingApproval.publishedApprovalRecord === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.publishedApprovalRecord
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.precedingApproval.initialPublishedHandoff === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.initialPublishedHandoff
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.precedingApproval.currentReconciliation === EN_E11_OWL_HUSHMASK_PROWLER_GATE.baseCheckpoint,
  'Owl predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E11_OWL_COMMON_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E11_OWL_COMMON_CONTRACT_CARD.activeVariant.id === 'hushmask-prowler'
    && EN_E11_OWL_COMMON_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E11_OWL_COMMON_CONTRACT_CARD.precedingGate === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id
    && EN_E11_OWL_COMMON_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E11_OWL_COMMON_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite'])
    && EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.state === 'implemented-complete-motion-approved',
  'Owl common role or candidate contract drifted',
);
check(
  EN_E11_OWL_HUSHMASK_PROWLER_DATA.actorTopology === EN_E11_OWL_TOPOLOGY_DECISION.selected
    && EN_E11_OWL_HUSHMASK_PROWLER_DATA.childAssets.length === 0
    && EN_E11_OWL_HUSHMASK_PROWLER_DATA.bakedEffects.length === 0
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.animationContract.includes('opens both body-owned wings into a broad silent crescent screen')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.exclusions.includes('registration')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.exclusions.includes('fixtures')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.exclusions.includes('Phoenix')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.nextGate.includes('No continuation request')
    && EN_E11_OWL_HUSHMASK_PROWLER_GATE.nextGate.includes('Owl specialist or elite'),
  'Owl anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E11_OWL_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E11_OWL_COMMON_CONTRACT_CARD)
    && Object.isFrozen(EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT)
    && Object.isFrozen(EN_E11_OWL_HUSHMASK_PROWLER_DATA)
    && Object.isFrozen(EN_E11_OWL_HUSHMASK_PROWLER_GATE),
  'Owl topology, contracts, data, and gate must be deeply immutable',
);
check(
  EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY.families.length === 1
    && EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY.publicFamilies.length === 0
    && EN_E11_OWL_HUSHMASK_PROWLER_FAMILY.variants.length === 1,
  'private Owl registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 100 && publicVariantCount === 316 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'owl'), 'candidate must preserve public 100/316 and keep Owl private');
check(engine.EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const backlogSource = await readFile(path.join(root, 'engine', 'enemy-expansion-approved-backlog-v3.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [backlogSource, 'approved backlog'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('hushmask-prowler'), label + ' must not mention Hushmask Prowler');
check(JSON.stringify(EN_E11_OWL_HUSHMASK_PROWLER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], cinderquill: [], rainfan: [], harpy: [] };
const colors = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
const palettes = [
  ['head', new Set(colors.head)], ['body', new Set(colors.body)], ['wing', new Set(colors.wing)],
  ['tail', new Set(colors.tail)], ['bar', new Set(colors.bar)],
  ['talon', new Set(colors.talon)],
];
let connected = 0, bounded = 0, grounded = 0, twoFootRows = 0, roundOwlSpans = 0, crescentViews = 0;
let colored = 0, flashes = 0, eyeViews = 0, beakViews = 0, headViews = 0, facialDiskViews = 0, throatPaletteViews = 0, shortTailViews = 0, barViews = 0, wingViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { cinderquill: 0, rainfan: 0, harpy: 0 };
const alphaDifferences = { cinderquill: 0, rainfan: 0, harpy: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const cinderquill = captureEnemyExpansionFrame(EN_E11_RAVEN_CINDERQUILL_SCAVENGER_REGISTRY, specs.cinderquill, direction, animation.id, frame);
    const rainfan = captureEnemyExpansionFrame(EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY, specs.rainfan, direction, animation.id, frame);
    const harpy = captureLegacyFrame(specs.harpy, direction, animation.id, frame);
    const compared = { cinderquill, rainfan, harpy };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.cinderquill.push(frameRecord(cinderquill, specs.cinderquill, direction, animation.id, frame));
    records.rainfan.push(frameRecord(rainfan, specs.rainfan, direction, animation.id, frame));
    records.harpy.push(frameRecord(harpy, specs.harpy, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost talon ground contact');
    check(candidate.opaquePixels >= 150 && candidate.opaquePixels <= 380, captureKey + ' density is implausible for a compact natural Owl');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 2) twoFootRows++; else check(false, captureKey + ' lost exactly two separated grounded three-toed foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const roundOwlSpan = (direction === 'left' || direction === 'right') ? width >= 17 && height >= 20 : width >= 14 && height >= 20;
    if (roundOwlSpan) roundOwlSpans++; else check(false, captureKey + ' lost the compact round Owl span at ' + width + 'x' + height);

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
      if (countColors(candidate.pixels, new Set(colors.head)) >= 16) headViews++;
      const throatCount = countColors(candidate.pixels, new Set(colors.throat));
      if (throatCount > 0) throatPaletteViews++;
      if (direction !== 'up' && throatCount >= 24) facialDiskViews++;
      if (countColors(candidate.pixels, new Set(colors.tail)) > 0) shortTailViews++;
      if (countColors(candidate.pixels, new Set(colors.bar)) > 0) barViews++;
      if (countColors(candidate.pixels, new Set(colors.wing)) > 0) wingViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && beakCount === 0, captureKey + ' rear view must not expose eye, face, or beak pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired amber eyes');
        check(featureCount === 2, captureKey + ' front view must preserve paired compact face features');
        check(beakCount >= 7, captureKey + ' front view must preserve the small ochre hooked beak');
        eyeViews++; beakViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one amber profile eye');
        check(featureCount === 1, captureKey + ' side view must preserve one compact profile feature');
        check(beakCount >= 6, captureKey + ' side view must preserve the small ochre profile beak');
        eyeViews++; beakViews++;
      }
      const crescent = (animation.id === 'attack' || animation.id === 'cast') && (frame === 1 || frame === 2);
      if (crescent) {
        check(countColors(candidate.pixels, new Set(colors.wing)) >= 45, captureKey + ' crescent attack must preserve a broad smoke-brown wing read');
        const minimumCrescentWidth = (direction === 'left' || direction === 'right') ? 20 : 22;
        check(width >= minimumCrescentWidth, captureKey + ' crescent attack must produce a broad body-owned wing silhouette');
        crescentViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.owlHushmaskProwlerGate === EN_E11_OWL_HUSHMASK_PROWLER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E11_OWL_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E11_OWL_HUSHMASK_PROWLER_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E11_OWL_HUSHMASK_PROWLER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E11_OWL_HUSHMASK_PROWLER_GATE.candidateFrameDigest) check(digests.candidate === EN_E11_OWL_HUSHMASK_PROWLER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E11_OWL_HUSHMASK_PROWLER_GATE.cinderquillComparisonDigest) check(digests.cinderquill === EN_E11_OWL_HUSHMASK_PROWLER_GATE.cinderquillComparisonDigest, 'Cinderquill Scavenger comparison digest drifted');
if (EN_E11_OWL_HUSHMASK_PROWLER_GATE.rainfanComparisonDigest) check(digests.rainfan === EN_E11_OWL_HUSHMASK_PROWLER_GATE.rainfanComparisonDigest, 'Rainfan Forager comparison digest drifted');
if (EN_E11_OWL_HUSHMASK_PROWLER_GATE.harpyComparisonDigest) check(digests.harpy === EN_E11_OWL_HUSHMASK_PROWLER_GATE.harpyComparisonDigest, 'Harpy comparison digest drifted');
check(digests.cinderquill === EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest, 'approved Cinderquill Scavenger comparison source drifted');
check(digests.rainfan === EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.candidateFrameDigest, 'approved Rainfan Forager comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Hushmask frames must be connected, bounded, and grounded');
check(twoFootRows === 80 && roundOwlSpans === 80, 'all 80 frames must preserve two talon contacts and the compact round Owl span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && beakViews === 54 && headViews === 72 && facialDiskViews === 54 && throatPaletteViews === 72 && shortTailViews === 72 && barViews === 72 && wingViews === 72 && crescentViews === 16, 'colored, flash, eye, beak, head, facial-disk, throat, short-tail, bar, wing, or crescent totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Hushmask Prowler must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E11_OWL_HUSHMASK_PROWLER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E11_OWL_HUSHMASK_PROWLER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E11_OWL_HUSHMASK_PROWLER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E11_OWL_HUSHMASK_PROWLER_GATE.comparisonArtifact],
]) if (EN_E11_OWL_HUSHMASK_PROWLER_GATE[field]) check(await fileHash(relative) === EN_E11_OWL_HUSHMASK_PROWLER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E11_OWL_HUSHMASK_PROWLER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY, { ...specs.candidate, family: 'birdfolk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY, { ...specs.candidate, variant: 'phoenix' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E11 Owl Hushmask Prowler focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E11 Owl Hushmask Prowler private common candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Owl identity: ' + twoFootRows + '/80 two three-toed talon rows; ' + roundOwlSpans + '/80 compact round spans; ' + crescentViews + '/16 broad crescent views; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + headViews + '/72 head views; ' + facialDiskViews + '/54 facial-disk views; ' + throatPaletteViews + '/72 throat-palette views; ' + shortTailViews + '/72 short fan-tail views; ' + barViews + '/72 barred-feather views; ' + wingViews + '/72 wing views');
  console.log('- Distinction: Cinderquill ' + differences.cinderquill + '/80; Rainfan ' + differences.rainfan + '/80; Harpy ' + differences.harpy + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Cinderquill and Rainfan exact; public Harpy and 100/316 exact; zero child assets/effects; no registration, outline registration, or fixtures');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Cinderquill frame digest: ' + digests.cinderquill);
  console.log('- Approved Rainfan frame digest: ' + digests.rainfan);
  console.log('- Public Harpy frame digest: ' + digests.harpy);
}
