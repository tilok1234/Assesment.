import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { EN_E07_MIREMANE_COURSER_GATE, EN_E07_MIREMANE_COURSER_REGISTRY } from '../engine/enemy-expansion-en-e07-kelpie-miremane-courser.js';
import {
  EN_E10_DUNEBACK_SCAVENGER_GATE,
  EN_E10_DUNEBACK_SCAVENGER_REGISTRY,
  EN_E10_HYENA_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e10-hyena-duneback-scavenger.js';
import {
  EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT,
  EN_E10_GLOAMSTRIPE_AMBUSHER_DATA,
  EN_E10_GLOAMSTRIPE_AMBUSHER_DEATH_SOURCE_FRAMES,
  EN_E10_GLOAMSTRIPE_AMBUSHER_FAMILY,
  EN_E10_GLOAMSTRIPE_AMBUSHER_GATE,
  EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY,
  EN_E10_HYENA_SPECIALIST_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e10-hyena-gloamstripe-ambusher.js';
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
  candidate: { kind: 'enemy', family: 'hyena', variant: 'gloamstripe-ambusher' },
  duneback: { kind: 'enemy', family: 'hyena', variant: 'duneback-scavenger' },
  miremane: { kind: 'enemy', family: 'kelpie', variant: 'miremane-courser' },
  direWolf: { kind: 'enemy', family: 'wolf', variant: 'dire' },
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
    && EN_E10_HYENA_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Hyena topology decision drifted',
);
check(
  EN_E10_DUNEBACK_SCAVENGER_GATE.status === 'approved'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.candidateFrameDigest === '353bd2ee9818a9eac8e799a7bc0e041cb6841509d61d3aabd695e86cd146db4d'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.publishedImplementation === 'e0e5e36bd6769a334f06e72db3de67c836021c46'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.publishedApprovalRecord === 'eab51c5045a2f8c3f211476e1de640d64940dbc5'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.initialPublishedHandoff === 'b639080386473c44504bc5b7adab527e82fc4fdd'
    && EN_E10_DUNEBACK_SCAVENGER_GATE.publicationState === 'published',
  'published Duneback predecessor drifted',
);
check(
  EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.status === 'approved'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.baseCheckpoint === '153ca132f94cc2360eca2c0366602ff400f871df'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.authorizedOn === '2026-08-13'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.authorizationEvidence.includes('designer said: lets do nex t')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.authorizationEvidence.includes('exactly one private specialist Hyena full 80-frame candidate')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.authorizationEvidence.includes('distinct outlined image')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.authorizationEvidence.includes('does not authorize public outline registration')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.approvedOn === '2026-08-13'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.approvalEvidence.includes('approved lets do nex t')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.approvalEvidence.includes('raw sprite 19')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.approvalEvidence.includes('outlined sprite 23')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.approvalEvidence.includes('Complete B + Form sprite 27')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.approvalEvidence.includes('active comparison sprite 31')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.approvalEvidence.includes('6da5c64d98252021280fe6edd867dbe1dc5afa17a0e79a73152194860d52b885')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.approvedImplementation === '5d35ed0c36f84646270a3d02b13e63559798aa01'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publishedImplementation === '5d35ed0c36f84646270a3d02b13e63559798aa01'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publishedApprovalRecord === '76ed7212ccddc33d1fcafa1ec97b26eb8963f096'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.initialPublishedHandoff === '1126852feae8f812c044806760a0063a7ef8d31f'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publicationState === 'published',
  'specialist authorization or outlined-image boundary drifted',
);
check(
  EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.precedingApproval.gateId === EN_E10_DUNEBACK_SCAVENGER_GATE.id
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.precedingApproval.candidateFrameDigest === EN_E10_DUNEBACK_SCAVENGER_GATE.candidateFrameDigest
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.precedingApproval.publishedImplementation === EN_E10_DUNEBACK_SCAVENGER_GATE.publishedImplementation
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.precedingApproval.publishedApprovalRecord === EN_E10_DUNEBACK_SCAVENGER_GATE.publishedApprovalRecord
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.precedingApproval.initialPublishedHandoff === EN_E10_DUNEBACK_SCAVENGER_GATE.initialPublishedHandoff
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.precedingApproval.currentReconciliation === EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.baseCheckpoint,
  'bounded Duneback publication tuple drifted',
);
check(
  JSON.stringify(EN_E10_HYENA_SPECIALIST_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_HYENA_SPECIALIST_CONTRACT_CARD.precedingVariant.id === 'duneback-scavenger'
    && EN_E10_HYENA_SPECIALIST_CONTRACT_CARD.activeVariant.id === 'gloamstripe-ambusher'
    && EN_E10_HYENA_SPECIALIST_CONTRACT_CARD.activeVariant.role === 'specialist'
    && JSON.stringify(EN_E10_HYENA_SPECIALIST_CONTRACT_CARD.deferredRoles) === JSON.stringify(['elite']),
  'Hyena specialist role boundary drifted',
);
check(
  EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT.silhouette.includes('lean dusk Hyena')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT.silhouette.includes('long connected neck-to-shoulder ruff')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT.visualIdentity.includes('cold angular cheek and flank stripes')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_DATA.actorTopology === EN_E10_HYENA_TOPOLOGY_DECISION.selected
    && EN_E10_GLOAMSTRIPE_AMBUSHER_DATA.childAssets.length === 0
    && EN_E10_GLOAMSTRIPE_AMBUSHER_DATA.bakedEffects.length === 0,
  'specialist identity or zero-child effect firewall drifted',
);
check(
  EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.scope.includes('complete 80-frame Gloamstripe Ambusher specialist Hyena')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.animationContract.includes('body-owned feint')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.reviewPresentation.includes('distinct Complete B outlined board')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.exclusions.includes('Hyena elite')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('implementation 5d35ed0c36f84646270a3d02b13e63559798aa01')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('approval record 76ed7212ccddc33d1fcafa1ec97b26eb8963f096')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('initial published handoff 1126852feae8f812c044806760a0063a7ef8d31f')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('remote verified')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('completes the bounded publication tuple')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('approved lets do nex t')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('exactly one private elite Hyena candidate')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('clean published reconciliation')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('review evidence only')
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.nextGate.includes('does not authorize outline registration'),
  'full-suite motion, review, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E10_HYENA_SPECIALIST_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT)
    && Object.isFrozen(EN_E10_GLOAMSTRIPE_AMBUSHER_DATA)
    && Object.isFrozen(EN_E10_GLOAMSTRIPE_AMBUSHER_GATE),
  'specialist contract, data, and gate must be deeply immutable',
);
check(
  EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY.families.length === 1
    && EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY.publicFamilies.length === 0
    && EN_E10_GLOAMSTRIPE_AMBUSHER_FAMILY.variants.length === 1,
  'private specialist registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 92
    && publicVariantCount === 294
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'hyena'),
  'candidate must preserve public 92/294 and keep Hyena private',
);
check(engine.EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
check(!publicSource.includes('gloamstripe-ambusher'), 'public expansion registry must not mention Gloamstripe Ambusher');
check(!manifestSource.includes('gloamstripe-ambusher'), 'asset manifest must not mention Gloamstripe Ambusher');
check(!outlineSource.includes('gloamstripe-ambusher'), 'outline registry must not mention Gloamstripe Ambusher');
check(JSON.stringify(EN_E10_GLOAMSTRIPE_AMBUSHER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], duneback: [], miremane: [], direWolf: [] };
const colors = EN_E10_GLOAMSTRIPE_AMBUSHER_DATA.gloamstripeAmbusher;
const palettes = [
  ['fur', new Set(colors.fur)],
  ['ruff', new Set(colors.ruff)],
  ['belly', new Set(colors.belly)],
  ['stripe', new Set(colors.stripe)],
  ['ear', new Set(colors.ear)],
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
let outlinedPixels = 0;
let formChanges = 0;
const differences = { duneback: 0, miremane: 0, direWolf: 0 };
const alphaDifferences = { duneback: 0, miremane: 0, direWolf: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const duneback = captureEnemyExpansionFrame(EN_E10_DUNEBACK_SCAVENGER_REGISTRY, specs.duneback, direction, animation.id, frame);
    const miremane = captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY, specs.miremane, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const compared = { duneback, miremane, direWolf };
    captures.set(key, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.duneback.push(frameRecord(duneback, specs.duneback, direction, animation.id, frame));
    records.miremane.push(frameRecord(miremane, specs.miremane, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));

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
    check(candidate.opaquePixels >= 120 && candidate.opaquePixels <= 330, key + ' density is implausible for the specialist Hyena');
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
      const frameColors = new Set(candidate.pixels.filter(Boolean));
      check(frameColors.size === 1 && frameColors.has('#f4f4f4'), key + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, palette] of palettes) check(countColors(candidate.pixels, palette) > 0, key + ' lost ' + name + ' palette identity');
      check(countColors(candidate.pixels, new Set([colors.paw])) >= 8, key + ' lost four dark two-pixel paws');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0, key + ' rear view must not expose face pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, key + ' front view must preserve paired cyan eyes');
        check(featureCount >= 3, key + ' front view must preserve nostrils and mouth');
        eyeViews++;
        muzzleViews++;
      } else {
        check(eyeCount === 1, key + ' side view must preserve one cyan profile eye');
        check(featureCount >= 2, key + ' side view must preserve nose and jaw line');
        eyeViews++;
        muzzleViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.gloamstripeAmbusherGate === EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E10_HYENA_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E10_DUNEBACK_SCAVENGER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      key + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_GLOAMSTRIPE_AMBUSHER_DATA);
    outlinedPixels += presentation.complete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
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
    const hurt = captures.get(direction + '/hurt/' + EN_E10_GLOAMSTRIPE_AMBUSHER_DEATH_SOURCE_FRAMES[frame]);
    check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
  }
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.candidateFrameDigest) check(digests.candidate === EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.dunebackComparisonDigest) check(digests.duneback === EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.dunebackComparisonDigest, 'Duneback comparison digest drifted');
if (EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.miremaneComparisonDigest) check(digests.miremane === EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.miremaneComparisonDigest, 'Miremane comparison digest drifted');
if (EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.direWolfComparisonDigest) check(digests.direWolf === EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
check(digests.duneback === EN_E10_DUNEBACK_SCAVENGER_GATE.candidateFrameDigest, 'approved Duneback comparison source drifted');
check(digests.miremane === EN_E07_MIREMANE_COURSER_GATE.candidateFrameDigest, 'approved Miremane comparison source drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Gloamstripe frames must be connected, bounded, and grounded');
check(fourPawRows === 80 && quadrupedSpanFrames === 80, 'all 80 frames must preserve four paw runs and the grounded quadruped span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && muzzleViews === 54, 'colored, flash, eye-view, or muzzle-view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Gloamstripe Ambusher must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.comparisonArtifact],
]) {
  if (EN_E10_GLOAMSTRIPE_AMBUSHER_GATE[field]) check(await fileHash(relative) === EN_E10_GLOAMSTRIPE_AMBUSHER_GATE[field], field + ' drifted');
}
for (const review of Object.values(EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.reviewAnimations)) {
  if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');
}

rejects(() => captureEnemyExpansionFrame(EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY, { ...specs.candidate, variant: 'duneback-scavenger' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Hyena Gloamstripe Ambusher focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Hyena Gloamstripe Ambusher private specialist candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Hyena identity: ' + fourPawRows + '/80 four-paw rows; ' + quadrupedSpanFrames + '/80 quadruped spans; ' + colored + '/72 colored frames; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + muzzleViews + '/54 readable muzzles');
  console.log('- Distinction: Duneback ' + differences.duneback + '/80; Miremane ' + differences.miremane + '/80; Dire Wolf ' + differences.direWolf + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Duneback and Miremane exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Duneback frame digest: ' + digests.duneback);
  console.log('- Approved Miremane frame digest: ' + digests.miremane);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
}
