import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E10_STAG_TOPOLOGY_DECISION,
  EN_E10_MOSSRACK_FORAGER_GATE,
  EN_E10_MOSSRACK_FORAGER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-stag-mossrack-forager.js';
import {
  EN_E10_BRIARSTEP_HARRIER_GATE,
  EN_E10_BRIARSTEP_HARRIER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-stag-briarstep-harrier.js';
import {
  EN_E10_STAG_ELITE_CONTRACT_CARD,
  EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT,
  EN_E10_GLOAMCROWN_SOVEREIGN_DATA,
  EN_E10_GLOAMCROWN_SOVEREIGN_DEATH_SOURCE_FRAMES,
  EN_E10_GLOAMCROWN_SOVEREIGN_FAMILY,
  EN_E10_GLOAMCROWN_SOVEREIGN_GATE,
  EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY,
} from '../engine/enemy-expansion-en-e10-stag-gloamcrown-sovereign.js';
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
  candidate: { kind: 'enemy', family: 'stag', variant: 'gloamcrown-sovereign' },
  briarstep: { kind: 'enemy', family: 'stag', variant: 'briarstep-harrier' },
  mossrack: { kind: 'enemy', family: 'stag', variant: 'mossrack-forager' },
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
      const x = index % 24, y = Math.floor(index / 24);
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
  EN_E10_STAG_TOPOLOGY_DECISION.status === 'selected'
    && EN_E10_STAG_TOPOLOGY_DECISION.selected === 'baked-single-actor-antlered-grounded-quadruped'
    && EN_E10_STAG_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Stag topology decision drifted',
);
check(
  EN_E10_BRIARSTEP_HARRIER_GATE.status === 'approved'
    && EN_E10_BRIARSTEP_HARRIER_GATE.candidateFrameDigest === 'fb352a405be53536a2304eb8ad97ef7e03f0819519607a8a0afea16e81f97457'
    && EN_E10_BRIARSTEP_HARRIER_GATE.publishedImplementation === '8d52dc26d9d361c5d95603276a4a88b3978a585e'
    && EN_E10_BRIARSTEP_HARRIER_GATE.publishedApprovalRecord === '895456020801fa40a31d7e83413895e0440c505e'
    && EN_E10_BRIARSTEP_HARRIER_GATE.initialPublishedHandoff === '40fd66c20f3b01ddd927ecb83c807c96c5feec7b'
    && EN_E10_BRIARSTEP_HARRIER_GATE.publicationState === 'published',
  'published Briarstep predecessor drifted',
);
check(
  EN_E10_GLOAMCROWN_SOVEREIGN_GATE.status === 'approved'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.baseCheckpoint === '595b2b2b18ebe7e111486df96624b4e1f057647b'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.authorizedOn === '2026-08-13'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.authorizationEvidence.includes('designer then separately said: awesine lets keep going')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.authorizationEvidence.includes('exactly one private elite Stag full 80-frame candidate')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.authorizationEvidence.includes('distinct Complete B outlined PNG')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.approvedOn === '2026-08-13'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.approvalEvidence.includes('raw sprite 131')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.approvalEvidence.includes('outlined sprite 135')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.approvalEvidence.includes('Complete B + Form sprite 139')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.approvalEvidence.includes('active comparison sprite 143')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.approvalEvidence.includes('5a80240ca6bfb16eb6a53b0b95b5214323a9dde25814b48fb39e9caaf11e4855')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.approvalEvidence.includes('designer replied: approved lets do next')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.approvedImplementation === '0ece468efeaf4b50351358020075b4bf91dc7cff'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publicationAuthorizedOn === '2026-08-13'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publishedImplementation === '0ece468efeaf4b50351358020075b4bf91dc7cff'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publishedApprovalRecord === '378ec3d107b43e6b354cadcad16f64e0a8cf838b'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.initialPublishedHandoff === 'be5d7c7316e035021ef805b0f1f6843b10df9c32'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publicationState === 'published'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.architectureDecision === EN_E10_STAG_TOPOLOGY_DECISION.id,
  'elite Stag approval, publication, or outlined-review boundary drifted',
);
check(
  EN_E10_GLOAMCROWN_SOVEREIGN_GATE.precedingApproval.gateId === EN_E10_BRIARSTEP_HARRIER_GATE.id
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.precedingApproval.candidateFrameDigest === EN_E10_BRIARSTEP_HARRIER_GATE.candidateFrameDigest
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.precedingApproval.outlinedArtifactSha256 === EN_E10_BRIARSTEP_HARRIER_GATE.outlinedArtifactSha256
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.precedingApproval.publishedImplementation === EN_E10_BRIARSTEP_HARRIER_GATE.publishedImplementation
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.precedingApproval.publishedApprovalRecord === EN_E10_BRIARSTEP_HARRIER_GATE.publishedApprovalRecord
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.precedingApproval.initialPublishedHandoff === EN_E10_BRIARSTEP_HARRIER_GATE.initialPublishedHandoff
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.precedingApproval.currentReconciliation === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.baseCheckpoint,
  'bounded Briarstep publication tuple drifted',
);
check(
  JSON.stringify(EN_E10_STAG_ELITE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_STAG_ELITE_CONTRACT_CARD.precedingVariant.id === 'briarstep-harrier'
    && EN_E10_STAG_ELITE_CONTRACT_CARD.activeVariant.id === 'gloamcrown-sovereign'
    && EN_E10_STAG_ELITE_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E10_STAG_ELITE_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E10_STAG_ELITE_CONTRACT_CARD.deferredRoles.length === 0,
  'Stag elite role boundary drifted',
);
check(
  EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT.state === 'implemented-complete-motion-approved'
    && EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT.silhouette.includes('vast connected outward-branching crown antlers')
    && EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT.visualIdentity.includes('verdigris growth bands')
    && EN_E10_GLOAMCROWN_SOVEREIGN_DATA.actorTopology === EN_E10_STAG_TOPOLOGY_DECISION.selected
    && EN_E10_GLOAMCROWN_SOVEREIGN_DATA.childAssets.length === 0
    && EN_E10_GLOAMCROWN_SOVEREIGN_DATA.bakedEffects.length === 0,
  'authored elite Stag identity or zero-child effect firewall drifted',
);
check(
  EN_E10_GLOAMCROWN_SOVEREIGN_GATE.scope.includes('complete 80-frame Gloamcrown Sovereign elite Stag')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.animationContract.includes('body-owned antler lift')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.animationContract.includes('planted crown press')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.reviewPresentation.includes('distinct Complete B outlined')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.exclusions.includes('additional Stag variants')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.nextGate.includes('implementation 0ece468efeaf4b50351358020075b4bf91dc7cff')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.nextGate.includes('approval record 378ec3d107b43e6b354cadcad16f64e0a8cf838b')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.nextGate.includes('initial published handoff be5d7c7316e035021ef805b0f1f6843b10df9c32')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.nextGate.includes('reconciliation completes the bounded publication tuple')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.nextGate.includes('Mammoth actor-topology decision')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.nextGate.includes('baked-single-actor-tusked-heavy-grounded-quadruped')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.nextGate.includes('Mammoth pixels require separate explicit topology approval')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.nextGate.includes('review evidence only')
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.nextGate.includes('does not authorize outline registration'),
  'full-suite motion, review, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E10_STAG_ELITE_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT)
    && Object.isFrozen(EN_E10_GLOAMCROWN_SOVEREIGN_DATA)
    && Object.isFrozen(EN_E10_GLOAMCROWN_SOVEREIGN_GATE),
  'elite Stag contracts, data, and gate must be deeply immutable',
);
check(
  EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY.families.length === 1
    && EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY.publicFamilies.length === 0
    && EN_E10_GLOAMCROWN_SOVEREIGN_FAMILY.variants.length === 1,
  'private elite Stag registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'stag'), 'candidate must preserve public 92/294 and keep Stag private');
check(engine.EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
check(!publicSource.includes('gloamcrown-sovereign'), 'public expansion registry must not mention Gloamcrown Sovereign');
check(!manifestSource.includes('gloamcrown-sovereign'), 'asset manifest must not mention Gloamcrown Sovereign');
check(!outlineSource.includes('gloamcrown-sovereign'), 'outline registry must not mention Gloamcrown Sovereign');
check(JSON.stringify(EN_E10_GLOAMCROWN_SOVEREIGN_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], briarstep: [], mossrack: [], direWolf: [] };
const colors = EN_E10_GLOAMCROWN_SOVEREIGN_DATA.gloamcrownSovereign;
const palettes = [
  ['fur', new Set(colors.fur)], ['face', new Set(colors.face)], ['antler', new Set(colors.antler)],
  ['crownBand', new Set(colors.crownBand)], ['mantle', new Set(colors.mantle)], ['mark', new Set(colors.mark)], ['ear', new Set(colors.ear)],
];
let connected = 0, bounded = 0, grounded = 0, splitHoofRows = 0, cervidSpanFrames = 0;
let antlerFrames = 0, colored = 0, flashes = 0, eyeViews = 0, muzzleViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { briarstep: 0, mossrack: 0, direWolf: 0 };
const alphaDifferences = { briarstep: 0, mossrack: 0, direWolf: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY, specs.candidate, direction, animation.id, frame);
    const briarstep = captureEnemyExpansionFrame(EN_E10_BRIARSTEP_HARRIER_REGISTRY, specs.briarstep, direction, animation.id, frame);
    const mossrack = captureEnemyExpansionFrame(EN_E10_MOSSRACK_FORAGER_REGISTRY, specs.mossrack, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const compared = { briarstep, mossrack, direWolf };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.briarstep.push(frameRecord(briarstep, specs.briarstep, direction, animation.id, frame));
    records.mossrack.push(frameRecord(mossrack, specs.mossrack, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost hoof ground contact');
    check(candidate.opaquePixels >= 150 && candidate.opaquePixels <= 340, captureKey + ' density is implausible for the elite Stag');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const hoofRuns = rowRuns(candidate.pixels, 22);
    if (hoofRuns >= 4) splitHoofRows++; else check(false, captureKey + ' lost four separated grounded split-hoof runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const cervidSpan = (direction === 'left' || direction === 'right') ? width >= 20 : height >= 18;
    if (cervidSpan) cervidSpanFrames++; else check(false, captureKey + ' lost the broad long-necked crown-rack cervid span');

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
      if (countColors(candidate.pixels, new Set([...colors.antler, ...colors.crownBand])) >= 18) antlerFrames++; else check(false, captureKey + ' lost readable vast connected crown antlers');
      check(countColors(candidate.pixels, new Set([colors.hoof])) >= 8, captureKey + ' lost four dark split-hoof contacts');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      if (direction === 'up') check(eyeCount === 0 && featureCount === 0, captureKey + ' rear view must not expose face pixels');
      else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired amber-gold eyes');
        check(featureCount >= 3, captureKey + ' front view must preserve nostrils and mouth');
        check(countColors(candidate.pixels, new Set(colors.blaze)) >= 2, captureKey + ' front view must preserve pale sovereign facial blaze');
        eyeViews++; muzzleViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one amber-gold profile eye');
        check(featureCount >= 2, captureKey + ' side view must preserve nose and mouth line');
        check(countColors(candidate.pixels, new Set(colors.blaze)) >= 2, captureKey + ' side view must preserve pale sovereign facial blaze');
        eyeViews++; muzzleViews++;
      }
      colored++;
    }

    check(candidate.renderResult.gloamcrownSovereignGate === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.id
      && candidate.renderResult.architectureDecision === EN_E10_STAG_TOPOLOGY_DECISION.id
      && candidate.renderResult.approvedPrecedingGate === EN_E10_BRIARSTEP_HARRIER_GATE.id
      && candidate.renderResult.childAssetCount === 0,
    captureKey + ' renderer gate or child boundary drifted');
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_GLOAMCROWN_SOVEREIGN_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E10_GLOAMCROWN_SOVEREIGN_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E10_GLOAMCROWN_SOVEREIGN_GATE.candidateFrameDigest) check(digests.candidate === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E10_GLOAMCROWN_SOVEREIGN_GATE.briarstepComparisonDigest) check(digests.briarstep === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.briarstepComparisonDigest, 'Briarstep comparison digest drifted');
if (EN_E10_GLOAMCROWN_SOVEREIGN_GATE.mossrackComparisonDigest) check(digests.mossrack === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.mossrackComparisonDigest, 'Mossrack comparison digest drifted');
if (EN_E10_GLOAMCROWN_SOVEREIGN_GATE.direWolfComparisonDigest) check(digests.direWolf === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
check(digests.briarstep === EN_E10_BRIARSTEP_HARRIER_GATE.candidateFrameDigest, 'approved Briarstep comparison source drifted');
check(digests.mossrack === EN_E10_MOSSRACK_FORAGER_GATE.candidateFrameDigest, 'approved Mossrack comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Gloamcrown frames must be connected, bounded, and grounded');
check(splitHoofRows === 80 && cervidSpanFrames === 80, 'all 80 frames must preserve four split-hoof runs and the broad crown-rack cervid span');
check(antlerFrames === 72 && colored === 72 && flashes === 8 && eyeViews === 54 && muzzleViews === 54, 'antler, colored, flash, eye-view, or muzzle-view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Gloamcrown Sovereign must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_GLOAMCROWN_SOVEREIGN_GATE.artifact],
  ['outlinedArtifactSha256', EN_E10_GLOAMCROWN_SOVEREIGN_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E10_GLOAMCROWN_SOVEREIGN_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_GLOAMCROWN_SOVEREIGN_GATE.comparisonArtifact],
]) if (EN_E10_GLOAMCROWN_SOVEREIGN_GATE[field]) check(await fileHash(relative) === EN_E10_GLOAMCROWN_SOVEREIGN_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E10_GLOAMCROWN_SOVEREIGN_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY, { ...specs.candidate, variant: 'briarstep-harrier' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Stag Gloamcrown Sovereign focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Stag Gloamcrown Sovereign private elite candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Stag identity: ' + splitHoofRows + '/80 split-hoof rows; ' + cervidSpanFrames + '/80 crown-rack cervid spans; ' + antlerFrames + '/72 antler-bearing colored frames; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + muzzleViews + '/54 readable muzzles');
  console.log('- Distinction: Briarstep ' + differences.briarstep + '/80; Mossrack ' + differences.mossrack + '/80; Dire Wolf ' + differences.direWolf + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Briarstep and Mossrack exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Briarstep frame digest: ' + digests.briarstep);
  console.log('- Approved Mossrack frame digest: ' + digests.mossrack);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
}
