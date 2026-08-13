import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE,
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY,
  EN_E11_COCKATRICE_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e11-cockatrice-bramblecomb-scratcher.js';
import {
  EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE,
  EN_E11_COCKATRICE_GLOAMGAZE_STALKER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-cockatrice-gloamgaze-stalker.js';
import {
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT,
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA,
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DEATH_SOURCE_FRAMES,
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_FAMILY,
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE,
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_REGISTRY,
  EN_E11_COCKATRICE_ELITE_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e11-cockatrice-crowncoil-basilarch.js';
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
  candidate: { kind: 'enemy', family: 'cockatrice', variant: 'crowncoil-basilarch' },
  gloamgaze: { kind: 'enemy', family: 'cockatrice', variant: 'gloamgaze-stalker' },
  bramblecomb: { kind: 'enemy', family: 'cockatrice', variant: 'bramblecomb-scratcher' },
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
  EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.status === 'approved'
    && EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.publicationState === 'published'
    && EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.publishedImplementation === 'cb227af79e2e7db39609d8bb5524942387026333'
    && EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.publishedApprovalRecord === 'ab1cab569aa4fbd69a6b2ec9ca60f838792c481b'
    && EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.initialPublishedHandoff === '1fbad52011fb4e3d95c3b64f2b8ad280d290b22b'
    && EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.candidateFrameDigest === '7752f15be95848bb5af6d1b89e79cd9f07ff3f1be8776427857497773d5b4eb8',
  'published Gloamgaze predecessor tuple drifted',
);
check(
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.status === 'approved'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publicationState === 'published'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publishedImplementation === 'c01ac35a5862296469967255ffcadadfd5aaae4e'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publishedApprovalRecord === '335b5c467c10f2042128ef7e7f20367735422909'
    && EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.initialPublishedHandoff === '9347a28f6cef9c6ca11a163732674d203bc87d94',
  'published Bramblecomb predecessor tuple drifted',
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
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.status === 'approved'
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.authorizedOn === '2026-08-14'
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.baseCheckpoint === '9d5c942fbdeb49db8c232fc763972962b56e8837'
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.architectureDecision === EN_E11_COCKATRICE_TOPOLOGY_DECISION.id
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.authorizationEvidence.includes('cb227af79e2e7db39609d8bb5524942387026333')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.authorizationEvidence.includes('ab1cab569aa4fbd69a6b2ec9ca60f838792c481b')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.authorizationEvidence.includes('1fbad52011fb4e3d95c3b64f2b8ad280d290b22b')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.authorizationEvidence.includes('9d5c942fbdeb49db8c232fc763972962b56e8837')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.authorizationEvidence.includes('fresh continuation request: lets do next')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.authorizationEvidence.includes('exactly one private elite Cockatrice full 80-frame candidate only')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.authorizationEvidence.includes('does not approve candidate pixels')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.precedingApproval.gateId === EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.id
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.precedingApproval.candidateFrameDigest === EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.candidateFrameDigest
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.precedingApproval.currentReconciliation === '9d5c942fbdeb49db8c232fc763972962b56e8837'
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.approvedOn === '2026-08-14'
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.approvalEvidence.includes('5beeb0036af6f5c9dc9bfb64c0121e548a372f31ee257e53c0765e3b031c2bb0')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.approvalEvidence.includes('The designer replied: approved lets do next')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.approvalEvidence.includes('continuation is held')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.approvedImplementation === '5d4ebe9dea7a8a85d0adeec0e34a0b3be8a016ef'
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.publicationAuthorizedOn === '2026-08-14'
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.publicationAuthorizationEvidence.includes('commit and push all aproved please')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.publishedImplementation === ''
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.publishedApprovalRecord === ''
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.initialPublishedHandoff === ''
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.publicationState === 'approved-not-published'
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.nextGate.includes('5d4ebe9dea7a8a85d0adeec0e34a0b3be8a016ef')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.nextGate.includes('approval record')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.nextGate.includes('outline registration'),
  'Crowncoil approval record or predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E11_COCKATRICE_ELITE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E11_COCKATRICE_ELITE_CONTRACT_CARD.precedingVariant.id === 'gloamgaze-stalker'
    && EN_E11_COCKATRICE_ELITE_CONTRACT_CARD.precedingVariant.role === 'specialist'
    && EN_E11_COCKATRICE_ELITE_CONTRACT_CARD.activeVariant.id === 'crowncoil-basilarch'
    && EN_E11_COCKATRICE_ELITE_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E11_COCKATRICE_ELITE_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E11_COCKATRICE_ELITE_CONTRACT_CARD.deferredRoles) === JSON.stringify([])
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT.state === 'implemented-complete-motion-approved',
  'Cockatrice elite role contract drifted',
);
check(
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.actorTopology === EN_E11_COCKATRICE_TOPOLOGY_DECISION.selected
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.childAssets.length === 0
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.bakedEffects.length === 0
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.animationContract.includes('crown-brace')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.animationContract.includes('crown-hook press')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.exclusions.includes('registration')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.exclusions.includes('fixtures')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.exclusions.includes('approved Gloamgaze Stalker pixel changes')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.exclusions.includes('approved Bramblecomb Scratcher pixel changes')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.nextGate.includes('continuation lets do next remains held')
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.nextGate.includes('outline registration'),
  'Crowncoil anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E11_COCKATRICE_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E11_COCKATRICE_ELITE_CONTRACT_CARD)
    && Object.isFrozen(EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT)
    && Object.isFrozen(EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA)
    && Object.isFrozen(EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE),
  'Crowncoil topology, contracts, data, and gate must be deeply immutable',
);
check(
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_REGISTRY.families.length === 1
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_REGISTRY.publicFamilies.length === 0
    && EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_FAMILY.variants.length === 1,
  'private elite Cockatrice registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'cockatrice'), 'candidate must preserve public 92/294 and keep Cockatrice private');
check(engine.EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('crowncoil-basilarch'), label + ' must not mention Crowncoil Basilarch');
check(JSON.stringify(EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], gloamgaze: [], bramblecomb: [], marshCrocodile: [] };
const colors = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.cockatrice;
const palettes = [
  ['head', new Set(colors.head)], ['body', new Set(colors.body)], ['wing', new Set(colors.wing)],
  ['comb', new Set(colors.comb)], ['tail', new Set(colors.tail)], ['scale', new Set(colors.scale)],
  ['talon', new Set(colors.talon)],
];
const tailColors = new Set(colors.tail);
let connected = 0, bounded = 0, grounded = 0, twoFootRows = 0, naturalSpans = 0, tailHookViews = 0;
let colored = 0, flashes = 0, eyeViews = 0, beakViews = 0, combViews = 0, tailViews = 0, wingViews = 0, scaleViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { gloamgaze: 0, bramblecomb: 0, marshCrocodile: 0 };
const alphaDifferences = { gloamgaze: 0, bramblecomb: 0, marshCrocodile: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_REGISTRY, specs.candidate, direction, animation.id, frame);
    const gloamgaze = captureEnemyExpansionFrame(EN_E11_COCKATRICE_GLOAMGAZE_STALKER_REGISTRY, specs.gloamgaze, direction, animation.id, frame);
    const bramblecomb = captureEnemyExpansionFrame(EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY, specs.bramblecomb, direction, animation.id, frame);
    const marshCrocodile = captureLegacyFrame(specs.marshCrocodile, direction, animation.id, frame);
    const compared = { gloamgaze, bramblecomb, marshCrocodile };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.gloamgaze.push(frameRecord(gloamgaze, specs.gloamgaze, direction, animation.id, frame));
    records.bramblecomb.push(frameRecord(bramblecomb, specs.bramblecomb, direction, animation.id, frame));
    records.marshCrocodile.push(frameRecord(marshCrocodile, specs.marshCrocodile, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost talon ground contact');
    check(candidate.opaquePixels >= 160 && candidate.opaquePixels <= 380, captureKey + ' density is implausible for a broad elite Cockatrice');
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
        check(eyeCount === 2, captureKey + ' front view must preserve paired acid-gold eyes');
        check(featureCount === 2, captureKey + ' front view must preserve paired compact face features');
        check(beakCount >= 5, captureKey + ' front view must preserve the ivory hooked beak');
        eyeViews++; beakViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one acid-gold profile eye');
        check(featureCount === 1, captureKey + ' side view must preserve one compact profile feature');
        check(beakCount >= 6, captureKey + ' side view must preserve the ivory hooked beak');
        eyeViews++; beakViews++;
      }
      const tailHook = (animation.id === 'attack' || animation.id === 'cast') && (frame === 1 || frame === 2);
      if (tailHook) {
        check(outerBandColorCount(candidate.pixels, tailColors) >= 2, captureKey + ' connected crown-hook tail must reach the outer silhouette band');
        const hookedSpan = direction === 'left' || direction === 'right' ? 20 : 18;
        check(width >= hookedSpan, captureKey + ' connected crown-hook tail must create a broad attack silhouette');
        tailHookViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.cockatriceCrowncoilBasilarchGate === EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.id
        && candidate.renderResult.architectureDecision === EN_E11_COCKATRICE_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.candidateFrameDigest) check(digests.candidate === EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.gloamgazeComparisonDigest) check(digests.gloamgaze === EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.gloamgazeComparisonDigest, 'Gloamgaze comparison digest drifted');
if (EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.bramblecombComparisonDigest) check(digests.bramblecomb === EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.bramblecombComparisonDigest, 'Bramblecomb comparison digest drifted');
if (EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.marshCrocodileComparisonDigest) check(digests.marshCrocodile === EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.marshCrocodileComparisonDigest, 'Marsh Crocodile comparison digest drifted');
check(digests.gloamgaze === EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.candidateFrameDigest, 'approved Gloamgaze comparison source drifted');
check(digests.bramblecomb === EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.candidateFrameDigest, 'approved Bramblecomb comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Crowncoil frames must be connected, bounded, and grounded');
check(twoFootRows === 80 && naturalSpans === 80, 'all 80 frames must preserve two talon contacts and the grounded hybrid span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && beakViews === 54 && combViews === 72 && tailViews === 72 && wingViews === 72 && scaleViews === 72 && tailHookViews === 16, 'colored, flash, face, comb, tail, wing, scale, or tail-hook totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Crowncoil Basilarch must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.artifact],
  ['outlinedArtifactSha256', EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.comparisonArtifact],
]) if (EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE[field]) check(await fileHash(relative) === EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_REGISTRY, { ...specs.candidate, family: 'birdfolk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_REGISTRY, { ...specs.candidate, variant: 'phoenix' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E11 Cockatrice Crowncoil Basilarch focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E11 Cockatrice Crowncoil Basilarch approved private elite packet passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Cockatrice identity: ' + twoFootRows + '/80 two-talon rows; ' + naturalSpans + '/80 grounded hybrid spans; ' + tailHookViews + '/16 connected tail-hook views; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + combViews + '/72 comb views; ' + tailViews + '/72 tail views; ' + wingViews + '/72 wing views; ' + scaleViews + '/72 scale views');
  console.log('- Distinction: Gloamgaze ' + differences.gloamgaze + '/80; Bramblecomb ' + differences.bramblecomb + '/80; Marsh Crocodile ' + differences.marshCrocodile + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Gloamgaze and Bramblecomb exact; public Marsh Crocodile unchanged; public 92/294; zero child assets/effects; no registration, outline registration, or fixtures');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Gloamgaze frame digest: ' + digests.gloamgaze);
  console.log('- Approved Bramblecomb frame digest: ' + digests.bramblecomb);
  console.log('- Public Marsh Crocodile frame digest: ' + digests.marshCrocodile);
}
