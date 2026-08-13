import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E04_BIRDFOLK_AERIE_SCOUT_GATE,
  EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY,
} from '../engine/enemy-expansion-en-e04-birdfolk-aerie-scout.js';
import {
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE,
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY,
} from '../engine/enemy-expansion-en-e11-peacock-crownveil-sovereign.js';
import {
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT,
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA,
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DEATH_SOURCE_FRAMES,
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_FAMILY,
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE,
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY,
  EN_E11_COCKATRICE_COMMON_CONTRACT_CARD,
  EN_E11_COCKATRICE_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e11-cockatrice-bramblecomb-scratcher.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
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
  candidate: { kind: 'enemy', family: 'cockatrice', variant: 'bramblecomb-scratcher' },
  crownveil: { kind: 'enemy', family: 'peacock', variant: 'crownveil-sovereign' },
  aerieScout: { kind: 'enemy', family: 'birdfolk', variant: 'aerie-scout' },
  marshCrocodile: { kind: 'enemy', family: 'crocodile', variant: 'marsh' },
};

function check(condition, message) { if (!condition) errors.push(message); }
function hashJson(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
function frameRecord(captured, spec, direction, animation, frame, candidateFamily = true) {
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
function rowRuns(pixels, y) {
  let runs = 0, occupied = false;
  for (const color of pixels.slice(y * 24, (y + 1) * 24)) {
    if (color && !occupied) runs++;
    occupied = Boolean(color);
  }
  return runs;
}
function outerBandColorCount(pixels, colors) {
  return pixels.reduce((count, color, index) => {
    const x = index % 24;
    return count + (color && colors.has(color) && (x <= 3 || x >= 20) ? 1 : 0);
  }, 0);
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
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.status === 'approved'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publicationState === 'published'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publishedImplementation === '13ceea22b163ae87fe2b6acd9dcf0e45c6e800bc'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publishedApprovalRecord === '15d55e973e5b0d1566e2d3dec39981d37edf24b8'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.initialPublishedHandoff === 'dee859e09ea86ddb546082b4bb45290d06afa252',
  'published Crownveil predecessor tuple drifted',
);
check(
  EN_E11_COCKATRICE_TOPOLOGY_DECISION.status === 'selected'
    && EN_E11_COCKATRICE_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-serpent-tailed-cockerel'
    && EN_E11_COCKATRICE_TOPOLOGY_DECISION.approvalEvidence.includes('The designer replied approved')
    && EN_E11_COCKATRICE_TOPOLOGY_DECISION.approvalEvidence.includes('exactly one private common Cockatrice 80-frame candidate')
    && EN_E11_COCKATRICE_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Cockatrice topology decision drifted',
);
check(
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.status === 'approved'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.baseCheckpoint === '99fed17ec4815b6985288818796a85b9abc7d78d'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.architectureDecision === EN_E11_COCKATRICE_TOPOLOGY_DECISION.id
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.approvedOn === '2026-08-13'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.approvalEvidence.includes('approved lets do next')
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.approvalEvidence.includes('exactly one private specialist Cockatrice full 80-frame candidate')
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.approvedImplementation === 'c01ac35a5862296469967255ffcadadfd5aaae4e'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publicationAuthorizedOn === '2026-08-13'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publishedImplementation === ''
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publishedApprovalRecord === ''
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.initialPublishedHandoff === ''
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publicationState === 'approved-not-published'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.precedingApproval.gateId === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.id
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.precedingApproval.candidateFrameDigest === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.candidateFrameDigest
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.precedingApproval.currentReconciliation === EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.baseCheckpoint
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.nextGate.includes('private specialist Cockatrice full 80-frame candidate'),
  'Bramblecomb approval, publication boundary, or predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E11_COCKATRICE_COMMON_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E11_COCKATRICE_COMMON_CONTRACT_CARD.precedingFamily.finalVariant === 'crownveil-sovereign'
    && EN_E11_COCKATRICE_COMMON_CONTRACT_CARD.activeVariant.id === 'bramblecomb-scratcher'
    && EN_E11_COCKATRICE_COMMON_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E11_COCKATRICE_COMMON_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E11_COCKATRICE_COMMON_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite'])
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT.state === 'implemented-complete-motion-approved',
  'Cockatrice common role contract drifted',
);
check(
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.actorTopology === EN_E11_COCKATRICE_TOPOLOGY_DECISION.selected
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.childAssets.length === 0
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.bakedEffects.length === 0
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.animationContract.includes('connected serpent tail')
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.exclusions.includes('registration')
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.exclusions.includes('fixtures')
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.exclusions.includes('approved Crownveil Sovereign pixel changes')
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.nextGate.includes('Standing publication permission'),
  'Bramblecomb anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E11_COCKATRICE_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E11_COCKATRICE_COMMON_CONTRACT_CARD)
    && Object.isFrozen(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT)
    && Object.isFrozen(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA)
    && Object.isFrozen(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE),
  'Bramblecomb topology, contracts, data, and gate must be deeply immutable',
);
check(
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY.families.length === 1
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY.publicFamilies.length === 0
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_FAMILY.variants.length === 1,
  'private common Cockatrice registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'cockatrice'), 'candidate must preserve public 92/294 and keep Cockatrice private');
check(engine.EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('bramblecomb-scratcher'), label + ' must not mention Bramblecomb Scratcher');
check(JSON.stringify(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], crownveil: [], aerieScout: [], marshCrocodile: [] };
const colors = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.cockatrice;
const palettes = [
  ['head', new Set(colors.head)], ['body', new Set(colors.body)], ['wing', new Set(colors.wing)],
  ['comb', new Set(colors.comb)], ['tail', new Set(colors.tail)], ['scale', new Set(colors.scale)],
  ['talon', new Set(colors.talon)],
];
const tailColors = new Set(colors.tail);
let connected = 0, bounded = 0, grounded = 0, twoFootRows = 0, naturalSpans = 0, tailLashViews = 0;
let colored = 0, flashes = 0, eyeViews = 0, beakViews = 0, combViews = 0, tailViews = 0, wingViews = 0, scaleViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { crownveil: 0, aerieScout: 0, marshCrocodile: 0 };
const alphaDifferences = { crownveil: 0, aerieScout: 0, marshCrocodile: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const crownveil = captureEnemyExpansionFrame(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY, specs.crownveil, direction, animation.id, frame);
    const aerieScout = captureEnemyExpansionFrame(EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY, specs.aerieScout, direction, animation.id, frame);
    const marshCrocodile = captureLegacyFrame(specs.marshCrocodile, direction, animation.id, frame);
    const compared = { crownveil, aerieScout, marshCrocodile };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.crownveil.push(frameRecord(crownveil, specs.crownveil, direction, animation.id, frame));
    records.aerieScout.push(frameRecord(aerieScout, specs.aerieScout, direction, animation.id, frame, false));
    records.marshCrocodile.push(frameRecord(marshCrocodile, specs.marshCrocodile, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost talon ground contact');
    check(candidate.opaquePixels >= 120 && candidate.opaquePixels <= 330, captureKey + ' density is implausible for a grounded common Cockatrice');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 2) twoFootRows++; else check(false, captureKey + ' lost exactly two separated grounded talon runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const naturalSpan = (direction === 'left' || direction === 'right') ? width >= 20 && height >= 21 : width >= 14 && height >= 21;
    if (naturalSpan) naturalSpans++; else check(false, captureKey + ' lost the grounded cockerel-and-serpent span at ' + width + 'x' + height);

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
      if (countColors(candidate.pixels, new Set(colors.comb)) > 0) combViews++;
      if (countColors(candidate.pixels, tailColors) > 0) tailViews++;
      if (countColors(candidate.pixels, new Set(colors.wing)) > 0) wingViews++;
      if (countColors(candidate.pixels, new Set(colors.scale)) > 0) scaleViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && beakCount === 0, captureKey + ' rear view must not expose eye, face, or beak pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired amber eyes');
        check(featureCount === 2, captureKey + ' front view must preserve paired compact face features');
        check(beakCount >= 5, captureKey + ' front view must preserve the old-ivory hooked beak');
        eyeViews++; beakViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one amber profile eye');
        check(featureCount === 1, captureKey + ' side view must preserve one compact profile feature');
        check(beakCount >= 6, captureKey + ' side view must preserve the old-ivory hooked beak');
        eyeViews++; beakViews++;
      }
      const tailLash = (animation.id === 'attack' || animation.id === 'cast') && (frame === 1 || frame === 2);
      if (tailLash) {
        check(outerBandColorCount(candidate.pixels, tailColors) >= 2, captureKey + ' connected tail lash must reach the outer silhouette band');
        check(width >= 20, captureKey + ' connected tail lash must create a broad attack silhouette');
        tailLashViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.cockatriceBramblecombScratcherGate === EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E11_COCKATRICE_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.candidateFrameDigest) check(digests.candidate === EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.crownveilComparisonDigest) check(digests.crownveil === EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.crownveilComparisonDigest, 'Crownveil comparison digest drifted');
if (EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.aerieScoutComparisonDigest) check(digests.aerieScout === EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.aerieScoutComparisonDigest, 'Aerie Scout comparison digest drifted');
if (EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.marshCrocodileComparisonDigest) check(digests.marshCrocodile === EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.marshCrocodileComparisonDigest, 'Marsh Crocodile comparison digest drifted');
check(digests.crownveil === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.candidateFrameDigest, 'approved Crownveil comparison source drifted');
check(digests.aerieScout === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.candidateFrameDigest, 'approved Aerie Scout comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Bramblecomb frames must be connected, bounded, and grounded');
check(twoFootRows === 80 && naturalSpans === 80, 'all 80 frames must preserve two talon contacts and the grounded hybrid span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && beakViews === 54 && combViews === 72 && tailViews === 72 && wingViews === 72 && scaleViews === 72 && tailLashViews === 16, 'colored, flash, face, comb, tail, wing, scale, or tail-lash totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Bramblecomb Scratcher must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.comparisonArtifact],
]) if (EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE[field]) check(await fileHash(relative) === EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY, { ...specs.candidate, family: 'birdfolk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY, { ...specs.candidate, variant: 'phoenix' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E11 Cockatrice Bramblecomb Scratcher focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E11 Cockatrice Bramblecomb Scratcher approved private common packet passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Cockatrice identity: ' + twoFootRows + '/80 two-talon rows; ' + naturalSpans + '/80 grounded hybrid spans; ' + tailLashViews + '/16 connected tail-lash views; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + combViews + '/72 comb views; ' + tailViews + '/72 tail views; ' + wingViews + '/72 wing views; ' + scaleViews + '/72 scale views');
  console.log('- Distinction: Crownveil ' + differences.crownveil + '/80; Aerie Scout ' + differences.aerieScout + '/80; Marsh Crocodile ' + differences.marshCrocodile + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Crownveil and Aerie Scout exact; public Marsh Crocodile unchanged; public 92/294; zero child assets/effects; no registration, outline registration, or fixtures');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Crownveil frame digest: ' + digests.crownveil);
  console.log('- Approved Aerie Scout frame digest: ' + digests.aerieScout);
  console.log('- Public Marsh Crocodile frame digest: ' + digests.marshCrocodile);
}
