import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE,
  EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-peacock-mirrorfan-ambusher.js';
import {
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_REGISTRY,
  EN_E11_RAVEN_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e11-raven-cinderquill-scavenger.js';
import {
  EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_DEATH_SOURCE_FRAMES,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_FAMILY,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY,
  EN_E11_RAVEN_SPECIALIST_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e11-raven-mournglass-scrier.js';
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
  candidate: { kind: 'enemy', family: 'raven', variant: 'mournglass-scrier' },
  cinderquill: { kind: 'enemy', family: 'raven', variant: 'cinderquill-scavenger' },
  mirrorfan: { kind: 'enemy', family: 'peacock', variant: 'mirrorfan-ambusher' },
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
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.status === 'approved'
    && EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.publicationState === 'published'
    && EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest
    && EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.publishedImplementation === '0e1124d6e16f3c5e568b0fe38890eb270b41306d'
    && EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.publishedApprovalRecord === '368754e9c037d7f37793ac737e162a3c5a4572f7'
    && EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.initialPublishedHandoff === '0e455f9665400003fbb55c4a59260016c80f40cd',
  'published Cinderquill predecessor drifted',
);
check(
  EN_E11_RAVEN_TOPOLOGY_DECISION.status === 'selected'
    && EN_E11_RAVEN_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-folded-wing-corvid'
    && EN_E11_RAVEN_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Raven topology decision drifted',
);
check(
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.status === 'approved'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.baseCheckpoint === 'e7cedbc569ac0ad5c405efbf9b888e167cb8f671'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.architectureDecision === EN_E11_RAVEN_TOPOLOGY_DECISION.id,
  'Mournglass candidate gate identity or base checkpoint drifted',
);
check(
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.authorizationEvidence.includes('awesome lets keep going')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.authorizationEvidence.includes('exactly one private specialist Raven full 80-frame candidate')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.authorizationEvidence.includes('role was not pre-named')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.authorizationEvidence.includes('does not approve candidate pixels'),
  'Mournglass authorization evidence drifted',
);
check(
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.approvedOn === '2026-08-14'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.approvalEvidence.includes('The designer replied: approved')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.approvalEvidence.includes('59b3b963b18edf1385fcc13252ec702cfa7d87c48ec8aaf8e34039becbfc8f1a')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.approvalEvidence.includes('six frozen review hashes')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.approvedImplementation === 'ca79bdeced0161f720775e405416d98cd809314f'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publicationAuthorizedOn === '2026-08-14'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publishedImplementation === 'ca79bdeced0161f720775e405416d98cd809314f'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publishedApprovalRecord === '5e50ad8bf12e6782800be71a7e7613684fc7bb49'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.initialPublishedHandoff === '930d589f4ab77598bbd11fe925a838b99e52556d'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publicationState === 'published'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.nextGate.includes('ca79bdeced0161f720775e405416d98cd809314f')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.nextGate.includes('5e50ad8bf12e6782800be71a7e7613684fc7bb49')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.nextGate.includes('930d589f4ab77598bbd11fe925a838b99e52556d')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.nextGate.includes('completes the bounded Raven specialist publication tuple')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.nextGate.includes('No continuation request')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.nextGate.includes('outline registration'),
  'Mournglass approval record or publication boundary drifted',
);
check(
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.precedingApproval.gateId === EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.id
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.precedingApproval.candidateFrameDigest === EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.precedingApproval.publishedImplementation === EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.publishedImplementation
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.precedingApproval.publishedApprovalRecord === EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.publishedApprovalRecord
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.precedingApproval.initialPublishedHandoff === EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.initialPublishedHandoff
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.precedingApproval.currentReconciliation === 'a56211531caaa55be96979af2f53aafaa08c1067'
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.precedingApproval.integrationCheckpoint === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.baseCheckpoint,
  'Mournglass predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E11_RAVEN_SPECIALIST_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E11_RAVEN_SPECIALIST_CONTRACT_CARD.precedingVariant.id === 'cinderquill-scavenger'
    && EN_E11_RAVEN_SPECIALIST_CONTRACT_CARD.activeVariant.id === 'mournglass-scrier'
    && EN_E11_RAVEN_SPECIALIST_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E11_RAVEN_SPECIALIST_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved-published-reconciled'
    && JSON.stringify(EN_E11_RAVEN_SPECIALIST_CONTRACT_CARD.deferredRoles) === JSON.stringify(['elite'])
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.state === 'implemented-complete-motion-approved',
  'Raven specialist role contract drifted',
);
check(
  EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.actorTopology === EN_E11_RAVEN_TOPOLOGY_DECISION.selected
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.childAssets.length === 0
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.bakedEffects.length === 0
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.animationContract.includes('tall scrying vane')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.exclusions.includes('registration')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.exclusions.includes('fixtures')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.exclusions.includes('Raven elite')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.nextGate.includes('No continuation request')
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.nextGate.includes('no Raven elite'),
  'Mournglass anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E11_RAVEN_SPECIALIST_CONTRACT_CARD)
    && Object.isFrozen(EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT)
    && Object.isFrozen(EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA)
    && Object.isFrozen(EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE),
  'Mournglass contracts, data, and gate must be deeply immutable',
);
check(
  EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY.families.length === 1
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY.publicFamilies.length === 0
    && EN_E11_RAVEN_MOURNGLASS_SCRIER_FAMILY.variants.length === 1,
  'private specialist Raven registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
const publicRaven = engine.PUBLIC_ENEMIES.find(({ id }) => id === 'raven');
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 100 && publicVariantCount === 316, 'candidate must preserve the integrated public 100/316 catalog');
check(JSON.stringify(publicRaven?.variants.map(({ id }) => id)) === JSON.stringify(['cinderquill-scavenger']), 'public Raven must retain only approved Cinderquill Scavenger');
check(engine.EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const backlogSource = await readFile(path.join(root, 'engine', 'enemy-expansion-approved-backlog-v3.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [backlogSource, 'approved V3 backlog'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('mournglass-scrier'), label + ' must not mention Mournglass Scrier');
check(JSON.stringify(EN_E11_RAVEN_MOURNGLASS_SCRIER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], cinderquill: [], mirrorfan: [], harpy: [] };
const colors = EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.raven;
const palettes = [
  ['head', new Set(colors.head)], ['body', new Set(colors.body)], ['wing', new Set(colors.wing)],
  ['throat', new Set(colors.throat)], ['tail', new Set(colors.tail)], ['glass', new Set(colors.glass)],
  ['omen', new Set(colors.omen)], ['talon', new Set(colors.talon)],
];
const allowedActorColors = new Set(Object.values(colors).flatMap((value) => Array.isArray(value) ? value : [value]));
let connected = 0, bounded = 0, grounded = 0, twoFootRows = 0, compactCorvidSpans = 0, sourceFootprints = 0, scryingVaneViews = 0;
let colored = 0, flashes = 0, eyeViews = 0, beakViews = 0, headViews = 0, throatViews = 0, tailViews = 0, glassViews = 0, omenViews = 0, wingViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { cinderquill: 0, mirrorfan: 0, harpy: 0 };
const alphaDifferences = { cinderquill: 0, mirrorfan: 0, harpy: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const cinderquill = captureEnemyExpansionFrame(EN_E11_RAVEN_CINDERQUILL_SCAVENGER_REGISTRY, specs.cinderquill, direction, animation.id, frame);
    const mirrorfan = captureEnemyExpansionFrame(EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_REGISTRY, specs.mirrorfan, direction, animation.id, frame);
    const harpy = captureLegacyFrame(specs.harpy, direction, animation.id, frame);
    const compared = { cinderquill, mirrorfan, harpy };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.cinderquill.push(frameRecord(cinderquill, specs.cinderquill, direction, animation.id, frame));
    records.mirrorfan.push(frameRecord(mirrorfan, specs.mirrorfan, direction, animation.id, frame));
    records.harpy.push(frameRecord(harpy, specs.harpy, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost talon ground contact');
    check(candidate.opaquePixels >= 130 && candidate.opaquePixels <= 360, captureKey + ' density is implausible for a specialist grounded Raven');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 2) twoFootRows++; else check(false, captureKey + ' lost exactly two separated grounded three-toed foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const compactCorvidSpan = (direction === 'left' || direction === 'right') ? width >= 18 && height >= 19 : width >= 14 && height >= 19;
    if (compactCorvidSpan) compactCorvidSpans++; else check(false, captureKey + ' lost the compact specialist corvid span at ' + width + 'x' + height);
    if (cinderquill.pixels.every((color, index) => !color || candidate.pixels[index])) sourceFootprints++; else check(false, captureKey + ' lost approved Cinderquill anatomy');

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
      check(candidate.pixels.every((color) => color === null || allowedActorColors.has(color)), captureKey + ' contains a color outside the Mournglass actor palette');
      for (const [name, palette] of palettes) check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      check(countColors(candidate.pixels, new Set(colors.talon)) >= 8, captureKey + ' lost two broad talon contacts');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      const beakCount = countColors(candidate.pixels, new Set(colors.beak));
      if (countColors(candidate.pixels, new Set(colors.head)) >= 16) headViews++;
      if (countColors(candidate.pixels, new Set(colors.throat)) > 0) throatViews++;
      if (countColors(candidate.pixels, new Set(colors.tail)) > 0) tailViews++;
      if (countColors(candidate.pixels, new Set(colors.glass)) > 0) glassViews++;
      if (countColors(candidate.pixels, new Set(colors.omen)) > 0) omenViews++;
      if (countColors(candidate.pixels, new Set(colors.wing)) > 0) wingViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && beakCount === 0, captureKey + ' rear view must not expose eye, face, or beak pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired cool-teal eyes');
        check(featureCount === 2, captureKey + ' front view must preserve paired compact face features');
        check(beakCount >= 7, captureKey + ' front view must preserve the hooked steel beak');
        eyeViews++; beakViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one cool-teal profile eye');
        check(featureCount === 1, captureKey + ' side view must preserve one compact profile feature');
        check(beakCount >= 6, captureKey + ' side view must preserve the hooked steel profile beak');
        eyeViews++; beakViews++;
      }
      const scryingVane = (animation.id === 'attack' || animation.id === 'cast') && (frame === 1 || frame === 2);
      if (scryingVane) {
        check(countColors(candidate.pixels, new Set(colors.wing)) >= 45, captureKey + ' scrying-vane attack must preserve a broad indigo wing read');
        check(width >= 21, captureKey + ' scrying-vane attack must produce a broad precise silhouette');
        scryingVaneViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.ravenMournglassScrierGate === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E11_RAVEN_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E11_RAVEN_MOURNGLASS_SCRIER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.candidateFrameDigest) check(digests.candidate === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.cinderquillComparisonDigest) check(digests.cinderquill === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.cinderquillComparisonDigest, 'Cinderquill comparison digest drifted');
if (EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.mirrorfanComparisonDigest) check(digests.mirrorfan === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.mirrorfanComparisonDigest, 'Mirrorfan comparison digest drifted');
if (EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.harpyComparisonDigest) check(digests.harpy === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.harpyComparisonDigest, 'Harpy comparison digest drifted');
check(digests.cinderquill === EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest, 'approved Cinderquill comparison source drifted');
check(digests.mirrorfan === EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.candidateFrameDigest, 'approved Mirrorfan comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80 && sourceFootprints === 80, 'all 80 Mournglass frames must be connected, bounded, grounded, and retain the approved source footprint');
check(twoFootRows === 80 && compactCorvidSpans === 80, 'all 80 frames must preserve two talon contacts and the compact grounded corvid span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && beakViews === 54 && headViews === 72 && throatViews === 72 && tailViews === 72 && glassViews === 72 && omenViews === 72 && wingViews === 72 && scryingVaneViews === 16, 'colored, flash, eye, beak, head, throat, tail, glass, omen, wing, or scrying-vane totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Mournglass Scrier must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.comparisonArtifact],
]) if (EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE[field]) check(await fileHash(relative) === EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY, { ...specs.candidate, family: 'birdfolk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY, { ...specs.candidate, variant: 'phoenix' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E11 Raven Mournglass Scrier focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E11 Raven Mournglass Scrier private specialist candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; source footprint ' + sourceFootprints + '/80; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Raven identity: ' + twoFootRows + '/80 two three-toed talon rows; ' + compactCorvidSpans + '/80 compact grounded spans; ' + scryingVaneViews + '/16 scrying-vane views; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + glassViews + '/72 moon-glass views; ' + omenViews + '/72 omen-mark views; ' + wingViews + '/72 wing views');
  console.log('- Distinction: Cinderquill ' + differences.cinderquill + '/80; Mirrorfan ' + differences.mirrorfan + '/80; Harpy ' + differences.harpy + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Cinderquill and Mirrorfan exact; public Harpy and 100/316 exact; zero child assets/effects; no registration, outline registration, or fixtures');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Cinderquill frame digest: ' + digests.cinderquill);
  console.log('- Approved Mirrorfan frame digest: ' + digests.mirrorfan);
  console.log('- Public Harpy frame digest: ' + digests.harpy);
}
