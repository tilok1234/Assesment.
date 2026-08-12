import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { EN_E07_MIREMANE_COURSER_GATE, EN_E07_MIREMANE_COURSER_REGISTRY } from '../engine/enemy-expansion-en-e07-kelpie-miremane-courser.js';
import { EN_E09_CROWNSEAL_GRIMOIRE_GATE } from '../engine/enemy-expansion-en-e09-living-book-crownseal-grimoire.js';
import {
  EN_E10_DUNEBACK_SCAVENGER_CONTRACT,
  EN_E10_DUNEBACK_SCAVENGER_DATA,
  EN_E10_DUNEBACK_SCAVENGER_DEATH_SOURCE_FRAMES,
  EN_E10_DUNEBACK_SCAVENGER_FAMILY,
  EN_E10_DUNEBACK_SCAVENGER_GATE,
  EN_E10_DUNEBACK_SCAVENGER_REGISTRY,
  EN_E10_HYENA_CONTRACT_CARD,
  EN_E10_HYENA_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e10-hyena-duneback-scavenger.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
  mirrorPixels,
  pixelDigest,
} from './enemy-expansion-review-pixels.mjs';

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
  candidate: { kind: 'enemy', family: 'hyena', variant: 'duneback-scavenger' },
  miremane: { kind: 'enemy', family: 'kelpie', variant: 'miremane-courser' },
  direWolf: { kind: 'enemy', family: 'wolf', variant: 'dire' },
  marshCrocodile: { kind: 'enemy', family: 'crocodile', variant: 'marsh' },
};

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function frameRecord(captured, spec, direction, animation, frame, candidateFamily = true) {
  return {
    family: spec.family,
    variant: spec.variant,
    ...(candidateFamily ? { candidateFamily: spec.family } : {}),
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
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
    minX: Math.min(...occupied.map(({ x }) => x)),
    minY: Math.min(...occupied.map(({ y }) => y)),
    maxX: Math.max(...occupied.map(({ x }) => x)),
    maxY: Math.max(...occupied.map(({ y }) => y)),
  } : null;
  return Object.freeze({
    pixels: Object.freeze(pixels),
    opaquePixels: occupied.length,
    bounds: bounds && Object.freeze(bounds),
    outOfBoundsWrites: Object.freeze(outOfBoundsWrites),
    digest: pixelDigest(pixels),
    alphaDigest: alphaDigest(pixels),
  });
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
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = (ny * 24) + nx;
        if (nx >= 0 && ny >= 0 && nx < 24 && ny < 24 && occupied.delete(next)) queue.push(next);
      }
    }
  }
  return components;
}

function countColors(pixels, colors) {
  return pixels.reduce((count, color) => count + (colors.has(color) ? 1 : 0), 0);
}

function rowRuns(pixels, y) {
  let runs = 0;
  let occupied = false;
  for (const color of pixels.slice(y * 24, (y + 1) * 24)) {
    if (color && !occupied) runs++;
    occupied = Boolean(color);
  }
  return runs;
}

async function fileHash(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

function rejects(action, label, expected = 'is not implemented') {
  try {
    action();
    errors.push(label + ' must reject');
  } catch (error) {
    check(String(error.message).includes(expected), label + ' rejected unexpectedly: ' + error.message);
  }
}

check(
  EN_E10_HYENA_TOPOLOGY_DECISION.status === 'selected'
    && EN_E10_HYENA_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-quadruped'
    && EN_E10_HYENA_TOPOLOGY_DECISION.selectedOn === '2026-08-13'
    && EN_E10_HYENA_TOPOLOGY_DECISION.evidence.includes('designer approved')
    && EN_E10_HYENA_TOPOLOGY_DECISION.childAssets.length === 0
    && EN_E10_HYENA_TOPOLOGY_DECISION.forbidden.includes('detached jaw')
    && EN_E10_HYENA_TOPOLOGY_DECISION.forbidden.includes('bite arcs'),
  'approved Hyena topology decision drifted',
);
check(
  EN_E10_DUNEBACK_SCAVENGER_GATE.status === 'approved'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.baseCheckpoint === 'ff9f9103e06e9edb7729b5efb61c237cf6d4a625'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.authorizedOn === '2026-08-13'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.authorizationEvidence.includes('designer replied: approved')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.authorizationEvidence.includes('only one private common Hyena Duneback Scavenger')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.approvedOn === '2026-08-13'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.approvalEvidence.includes('approved but for nex to ne please also post image of it outlined')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.approvalEvidence.includes('353bd2ee9818a9eac8e799a7bc0e041cb6841509d61d3aabd695e86cd146db4d')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.approvedImplementation === 'e0e5e36bd6769a334f06e72db3de67c836021c46'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.publicationState === 'approved-not-published',
  'private common authorization or awaiting-review state drifted',
);
check(
  EN_E10_DUNEBACK_SCAVENGER_GATE.precedingApproval.gateId === EN_E09_CROWNSEAL_GRIMOIRE_GATE.id
    && EN_E10_DUNEBACK_SCAVENGER_GATE.precedingApproval.candidateFrameDigest === EN_E09_CROWNSEAL_GRIMOIRE_GATE.candidateFrameDigest
    && EN_E10_DUNEBACK_SCAVENGER_GATE.precedingApproval.publishedImplementation === EN_E09_CROWNSEAL_GRIMOIRE_GATE.publishedImplementation
    && EN_E10_DUNEBACK_SCAVENGER_GATE.precedingApproval.publishedApprovalRecord === EN_E09_CROWNSEAL_GRIMOIRE_GATE.publishedApprovalRecord
    && EN_E10_DUNEBACK_SCAVENGER_GATE.precedingApproval.initialPublishedHandoff === EN_E09_CROWNSEAL_GRIMOIRE_GATE.initialPublishedHandoff
    && EN_E10_DUNEBACK_SCAVENGER_GATE.precedingApproval.currentReconciliation === EN_E10_DUNEBACK_SCAVENGER_GATE.baseCheckpoint,
  'published Crownseal predecessor drifted',
);
check(
  JSON.stringify(EN_E10_HYENA_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_HYENA_CONTRACT_CARD.variantBriefs.length === 3
    && EN_E10_HYENA_CONTRACT_CARD.activeVariant.id === 'duneback-scavenger'
    && EN_E10_HYENA_CONTRACT_CARD.activeVariant.role === 'common'
    && JSON.stringify(EN_E10_HYENA_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite']),
  'Hyena role order, three briefs, or common-only boundary drifted',
);
check(
  EN_E10_DUNEBACK_SCAVENGER_CONTRACT.silhouette.includes('high bristled shoulders')
    && EN_E10_DUNEBACK_SCAVENGER_CONTRACT.silhouette.includes('low narrow rump')
    && EN_E10_DUNEBACK_SCAVENGER_CONTRACT.visualIdentity.includes('irregular dark flank spots')
    && EN_E10_DUNEBACK_SCAVENGER_DATA.actorTopology === EN_E10_HYENA_TOPOLOGY_DECISION.selected
    && EN_E10_DUNEBACK_SCAVENGER_DATA.childAssets.length === 0
    && EN_E10_DUNEBACK_SCAVENGER_DATA.bakedEffects.length === 0,
  'authored Hyena identity or zero-child effect firewall drifted',
);
check(
  EN_E10_DUNEBACK_SCAVENGER_GATE.scope.includes('complete 80-frame Duneback Scavenger common Hyena')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.animationContract.includes('connected jaw-and-shoulder lunge')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.exclusions.includes('Hyena specialist or elite')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.exclusions.includes('Ram, Stag, Mammoth, or Rhino')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.exclusions.includes('Runic Idol or other EN-E09 work'),
  'full-suite motion or stop boundary drifted',
);
check(
  EN_E10_DUNEBACK_SCAVENGER_GATE.nextGate.includes('visually approved at implementation e0e5e36bd6769a334f06e72db3de67c836021c46')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.nextGate.includes('No next sprite is authorized')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.nextGate.includes('distinct outlined image')
    && EN_E10_DUNEBACK_SCAVENGER_GATE.nextGate.includes('not permission for outline registration'),
  'approval publication boundary or next-review outlined-image requirement drifted',
);
check(
  Object.isFrozen(EN_E10_HYENA_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E10_HYENA_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_DUNEBACK_SCAVENGER_CONTRACT)
    && Object.isFrozen(EN_E10_DUNEBACK_SCAVENGER_DATA)
    && Object.isFrozen(EN_E10_DUNEBACK_SCAVENGER_GATE),
  'topology, contracts, data, and gate must be deeply immutable',
);
check(
  EN_E10_DUNEBACK_SCAVENGER_REGISTRY.families.length === 1
    && EN_E10_DUNEBACK_SCAVENGER_REGISTRY.publicFamilies.length === 0
    && EN_E10_DUNEBACK_SCAVENGER_FAMILY.variants.length === 1,
  'private candidate registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 92
    && publicVariantCount === 294
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'hyena'),
  'candidate must preserve public 92/294 and keep Hyena private',
);
check(engine.EN_E10_DUNEBACK_SCAVENGER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('duneback-scavenger'), 'public expansion registry must not mention Duneback Scavenger');
check(!manifestSource.includes('duneback-scavenger'), 'asset manifest must not mention Duneback Scavenger');
check(JSON.stringify(EN_E10_DUNEBACK_SCAVENGER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], miremane: [], direWolf: [], marshCrocodile: [] };
const palettes = [
  ['fur', new Set(EN_E10_DUNEBACK_SCAVENGER_DATA.dunebackScavenger.fur)],
  ['mane', new Set(EN_E10_DUNEBACK_SCAVENGER_DATA.dunebackScavenger.mane)],
  ['belly', new Set(EN_E10_DUNEBACK_SCAVENGER_DATA.dunebackScavenger.belly)],
  ['spot', new Set(EN_E10_DUNEBACK_SCAVENGER_DATA.dunebackScavenger.spot)],
  ['ear', new Set(EN_E10_DUNEBACK_SCAVENGER_DATA.dunebackScavenger.ear)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let fourPawRows = 0;
let quadrupedSpanFrames = 0;
let colored = 0;
let flashes = 0;
let eyeViews = 0;
let muzzleViews = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let completeB = 0;
let formChanges = 0;
const differences = { miremane: 0, direWolf: 0, marshCrocodile: 0 };
const alphaDifferences = { miremane: 0, direWolf: 0, marshCrocodile: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_DUNEBACK_SCAVENGER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const miremane = captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY, specs.miremane, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const marshCrocodile = captureLegacyFrame(specs.marshCrocodile, direction, animation.id, frame);
    const compared = { miremane, direWolf, marshCrocodile };
    captures.set(key, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.miremane.push(frameRecord(miremane, specs.miremane, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));
    records.marshCrocodile.push(frameRecord(marshCrocodile, specs.marshCrocodile, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, key + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), key + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++;
    else check(false, key + ' must remain one connected actor');
    const isBounded = candidate.bounds
      && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1
      && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++;
    else check(false, key + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++;
    else check(false, key + ' lost paw ground contact');
    check(candidate.opaquePixels >= 115 && candidate.opaquePixels <= 315, key + ' density is implausible for the common Hyena');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const pawRuns = rowRuns(candidate.pixels, 22);
    if (pawRuns >= 4) fourPawRows++;
    else check(false, key + ' lost four separated grounded paw runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const quadrupedSpan = (direction === 'left' || direction === 'right') ? width >= 20 : height >= 19;
    if (quadrupedSpan) quadrupedSpanFrames++;
    else check(false, key + ' lost the grounded quadruped span');

    for (const name of Object.keys(compared)) {
      if (candidate.digest !== compared[name].digest) differences[name]++;
      if (candidate.alphaDigest !== compared[name].alphaDigest) alphaDifferences[name]++;
    }

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), key + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, key + ' lost ' + name + ' palette identity');
      check(countColors(candidate.pixels, new Set([EN_E10_DUNEBACK_SCAVENGER_DATA.dunebackScavenger.paw])) >= 8, key + ' lost four dark two-pixel paws');
      const eyeCount = countColors(candidate.pixels, new Set([EN_E10_DUNEBACK_SCAVENGER_DATA.dunebackScavenger.eye]));
      const featureCount = countColors(candidate.pixels, new Set([EN_E10_DUNEBACK_SCAVENGER_DATA.dunebackScavenger.feature]));
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0, key + ' rear view must not expose face pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, key + ' front view must preserve paired amber eyes');
        check(featureCount >= 3, key + ' front view must preserve nostrils and mouth');
        eyeViews++;
        muzzleViews++;
      } else {
        check(eyeCount === 1, key + ' side view must preserve one amber profile eye');
        check(featureCount >= 2, key + ' side view must preserve nose and jaw line');
        eyeViews++;
        muzzleViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.dunebackScavengerGate === EN_E10_DUNEBACK_SCAVENGER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E10_HYENA_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E09_CROWNSEAL_GRIMOIRE_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      key + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_DUNEBACK_SCAVENGER_DATA);
    completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
    formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
  }
  const uniqueMotion = new Set(animationDigests).size;
  if (animation.id === 'idle' || animation.id === 'hurt' || animation.id === 'death') check(uniqueMotion === 2, direction + ' ' + animation.id + ' must preserve both authored alias phases');
  else check(uniqueMotion >= 3, direction + ' ' + animation.id + ' must preserve distinct motion phases');
}

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame++) {
    const attack = captures.get(direction + '/attack/' + frame);
    const cast = captures.get(direction + '/cast/' + frame);
    check(cast.digest === attack.digest, direction + ' Cast C' + (frame + 1) + ' must alias Attack exactly');
    const death = captures.get(direction + '/death/' + frame);
    const hurt = captures.get(direction + '/hurt/' + EN_E10_DUNEBACK_SCAVENGER_DEATH_SOURCE_FRAMES[frame]);
    check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
  }
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E10_DUNEBACK_SCAVENGER_GATE.candidateFrameDigest) check(digests.candidate === EN_E10_DUNEBACK_SCAVENGER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E10_DUNEBACK_SCAVENGER_GATE.miremaneComparisonDigest) check(digests.miremane === EN_E10_DUNEBACK_SCAVENGER_GATE.miremaneComparisonDigest, 'Miremane comparison digest drifted');
if (EN_E10_DUNEBACK_SCAVENGER_GATE.direWolfComparisonDigest) check(digests.direWolf === EN_E10_DUNEBACK_SCAVENGER_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
if (EN_E10_DUNEBACK_SCAVENGER_GATE.marshCrocodileComparisonDigest) check(digests.marshCrocodile === EN_E10_DUNEBACK_SCAVENGER_GATE.marshCrocodileComparisonDigest, 'Marsh Crocodile comparison digest drifted');
check(digests.miremane === EN_E07_MIREMANE_COURSER_GATE.candidateFrameDigest, 'approved Miremane comparison source drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Duneback Scavenger frames must be connected, bounded, and grounded');
check(fourPawRows === 80 && quadrupedSpanFrames === 80, 'all 80 frames must preserve four paw runs and the grounded quadruped span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && muzzleViews === 54, 'colored, flash, eye-view, or muzzle-view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Duneback Scavenger must differ from ' + name + ' in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_DUNEBACK_SCAVENGER_GATE.artifact],
  ['assembledArtifactSha256', EN_E10_DUNEBACK_SCAVENGER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_DUNEBACK_SCAVENGER_GATE.comparisonArtifact],
]) {
  if (EN_E10_DUNEBACK_SCAVENGER_GATE[field]) check(await fileHash(relative) === EN_E10_DUNEBACK_SCAVENGER_GATE[field], field + ' drifted');
}
for (const review of Object.values(EN_E10_DUNEBACK_SCAVENGER_GATE.reviewAnimations)) {
  if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');
}

rejects(() => captureEnemyExpansionFrame(EN_E10_DUNEBACK_SCAVENGER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_DUNEBACK_SCAVENGER_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_DUNEBACK_SCAVENGER_REGISTRY, { ...specs.candidate, variant: 'bone-hyena' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Hyena Duneback Scavenger focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Hyena Duneback Scavenger private common candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Hyena identity: ' + fourPawRows + '/80 four-paw rows; ' + quadrupedSpanFrames + '/80 quadruped spans; ' + colored + '/72 colored frames; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + muzzleViews + '/54 readable muzzles');
  console.log('- Distinction: Miremane ' + differences.miremane + '/80; Dire Wolf ' + differences.direWolf + '/80; Marsh Crocodile ' + differences.marshCrocodile + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: approved Crownseal and Miremane exact; public 92/294; zero child assets/effects; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Miremane frame digest: ' + digests.miremane);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
  console.log('- Public Marsh Crocodile frame digest: ' + digests.marshCrocodile);
}
