import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import * as engine from '../sprite-engine.js';
import { ENEMY_EXPANSION_LEDGER } from '../engine/enemy-expansion.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E07_LANTERN_MOTE_GATE,
  EN_E07_LANTERN_MOTE_REGISTRY,
} from '../engine/enemy-expansion-en-e07-will-o-wisp-lantern-mote.js';
import {
  EN_E07_FENBELL_SHEPHERD_CONTRACT,
  EN_E07_FENBELL_SHEPHERD_DATA,
  EN_E07_FENBELL_SHEPHERD_DEATH_SOURCE_FRAMES,
  EN_E07_FENBELL_SHEPHERD_FAMILY,
  EN_E07_FENBELL_SHEPHERD_GATE,
  EN_E07_FENBELL_SHEPHERD_REGISTRY,
  EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e07-will-o-wisp-fenbell-shepherd.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
  pixelDigest,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};
const directions = ['down', 'left', 'right', 'up'];
const animations = [
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
];
const candidateSpec = { kind: 'enemy', family: 'will-o-wisp', variant: 'fenbell-shepherd' };
const lanternMoteSpec = { kind: 'enemy', family: 'will-o-wisp', variant: 'lantern-mote' };
const spectralGhostSpec = { kind: 'enemy', family: 'ghost', variant: 'spectral' };
const flameElementalSpec = { kind: 'enemy', family: 'elemental', variant: 'flame' };
const frameKey = (direction, animation, frame) => `${direction}/${animation}/${frame}`;
const hashJson = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const frameRecord = (captured, spec, direction, animation, frame, candidateFamily = true) => ({
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
});

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
  const occupied = pixels.flatMap((color, index) => (
    color === null ? [] : [{ x: index % 24, y: Math.floor(index / 24) }]
  ));
  const bounds = occupied.length ? {
    minX: Math.min(...occupied.map(({ x }) => x)),
    minY: Math.min(...occupied.map(({ y }) => y)),
    maxX: Math.max(...occupied.map(({ x }) => x)),
    maxY: Math.max(...occupied.map(({ y }) => y)),
  } : null;
  return Object.freeze({
    pixels: Object.freeze(pixels),
    alpha: Uint8Array.from(pixels, (color) => color === null ? 0 : 255),
    opaquePixels: occupied.length,
    bounds: bounds && Object.freeze(bounds),
    outOfBoundsWrites: Object.freeze(outOfBoundsWrites),
    digest: pixelDigest(pixels),
    alphaDigest: alphaDigest(pixels),
  });
}

function components(pixels) {
  const seen = new Set();
  let count = 0;
  for (let index = 0; index < 576; index++) {
    if (!pixels[index] || seen.has(index)) continue;
    count++;
    const queue = [index];
    seen.add(index);
    while (queue.length) {
      const current = queue.pop();
      const x = current % 24;
      for (const neighbor of [current - 24, current + 24, x ? current - 1 : -1, x < 23 ? current + 1 : -1]) {
        if (neighbor >= 0 && neighbor < 576 && pixels[neighbor] && !seen.has(neighbor)) {
          seen.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
  return count;
}

function mirrorPixels(pixels) {
  const result = new Array(576).fill(null);
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    result[(y * 24) + (23 - x)] = pixels[(y * 24) + x];
  }
  return result;
}

function countColors(pixels, colors) {
  return pixels.reduce((sum, color) => sum + (colors.has(color) ? 1 : 0), 0);
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

function rejects(action, label) {
  try {
    action();
    errors.push(`${label} must reject`);
  } catch (error) {
    check(String(error.message).includes('is not implemented'), `${label} rejected unexpectedly: ${error.message}`);
  }
}

check(
  EN_E07_FENBELL_SHEPHERD_GATE.status === 'approved'
    && EN_E07_FENBELL_SHEPHERD_GATE.approvedOn === '2026-08-11'
    && EN_E07_FENBELL_SHEPHERD_GATE.approvedImplementation === '04f113d6e2b95f290925eba040659b441e3cfcd1'
    && EN_E07_FENBELL_SHEPHERD_GATE.publishedImplementation === '04f113d6e2b95f290925eba040659b441e3cfcd1'
    && EN_E07_FENBELL_SHEPHERD_GATE.publishedApprovalRecord === '89e2e2cb271dc9af60dd4dce6fba3bccd03cd9d7'
    && EN_E07_FENBELL_SHEPHERD_GATE.initialPublishedHandoff === '462e7e5123d96f3ff928cd6ff908267cd313570b'
    && EN_E07_FENBELL_SHEPHERD_GATE.publicationState === 'published',
  'Fenbell Shepherd published state drifted',
);
check(
  EN_E07_FENBELL_SHEPHERD_GATE.approvalEvidence.includes('three exact frozen PNG review boards were opened together in responsive Aseprite')
    && EN_E07_FENBELL_SHEPHERD_GATE.approvalEvidence.includes('designer replied: approved')
    && EN_E07_FENBELL_SHEPHERD_GATE.approvalEvidence.includes('0a8000e33705967089ae66c98486eb701da88bfacd9f5adc38a47bbb62f5a46b')
    && EN_E07_FENBELL_SHEPHERD_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve'),
  'Fenbell Shepherd approval evidence or bounded publication authorization drifted',
);
check(
  EN_E07_FENBELL_SHEPHERD_GATE.baseCheckpoint === 'd734846067b3bf9dd05cadffef440ead1f6c6d3a'
    && EN_E07_FENBELL_SHEPHERD_GATE.authorizationEvidence.includes('designer replied: approved lets do next')
    && EN_E07_FENBELL_SHEPHERD_GATE.authorizationEvidence.includes('only one private specialist Fenbell Shepherd'),
  'Fenbell Shepherd authorization or base checkpoint drifted',
);
check(
  EN_E07_FENBELL_SHEPHERD_GATE.precedingApproval.gateId === EN_E07_LANTERN_MOTE_GATE.id
    && EN_E07_FENBELL_SHEPHERD_GATE.precedingApproval.candidateFrameDigest === EN_E07_LANTERN_MOTE_GATE.candidateFrameDigest
    && EN_E07_FENBELL_SHEPHERD_GATE.precedingApproval.publishedImplementation === EN_E07_LANTERN_MOTE_GATE.publishedImplementation
    && EN_E07_FENBELL_SHEPHERD_GATE.precedingApproval.publishedApprovalRecord === EN_E07_LANTERN_MOTE_GATE.publishedApprovalRecord
    && EN_E07_FENBELL_SHEPHERD_GATE.precedingApproval.initialPublishedHandoff === EN_E07_LANTERN_MOTE_GATE.initialPublishedHandoff
    && EN_E07_FENBELL_SHEPHERD_GATE.precedingApproval.currentReconciliation === 'd734846067b3bf9dd05cadffef440ead1f6c6d3a'
    && EN_E07_FENBELL_SHEPHERD_GATE.precedingApproval.reconciliationPublication === 'published',
  'Lantern Mote predecessor publication tuple drifted',
);
check(
  EN_E07_FENBELL_SHEPHERD_GATE.scope.includes('complete 80-frame Fenbell Shepherd specialist')
    && EN_E07_FENBELL_SHEPHERD_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E07_FENBELL_SHEPHERD_GATE.animationContract.includes('Death aliases Hurt H1,H2,H2,H2'),
  'Fenbell Shepherd full-suite contract drifted',
);
check(
  EN_E07_FENBELL_SHEPHERD_GATE.exclusions.includes('public Will-o-Wisp registration')
    && EN_E07_FENBELL_SHEPHERD_GATE.exclusions.includes('asset-pack fixture generation or regeneration')
    && EN_E07_FENBELL_SHEPHERD_GATE.exclusions.includes('Will-o-Wisp elite')
    && EN_E07_FENBELL_SHEPHERD_GATE.exclusions.includes('Changeling')
    && EN_E07_FENBELL_SHEPHERD_GATE.exclusions.includes('Kelpie')
    && EN_E07_FENBELL_SHEPHERD_GATE.exclusions.includes('EN-E08 and later work'),
  'Fenbell Shepherd exclusions drifted',
);
check(
  EN_E07_FENBELL_SHEPHERD_GATE.nextGate.includes('visually approved and published')
    && EN_E07_FENBELL_SHEPHERD_GATE.nextGate.includes('remote verified')
    && EN_E07_FENBELL_SHEPHERD_GATE.nextGate.includes('Stop at this clean publication reconciliation')
    && EN_E07_FENBELL_SHEPHERD_GATE.nextGate.includes('without another explicit authorization'),
  'Fenbell Shepherd published stop gate drifted',
);
check(
  Object.isFrozen(EN_E07_FENBELL_SHEPHERD_GATE)
    && Object.isFrozen(EN_E07_FENBELL_SHEPHERD_DATA)
    && Object.isFrozen(EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD),
  'Fenbell Shepherd gate, data, and family card must be deeply immutable',
);
check(
  JSON.stringify(EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD.activeVariant.id === 'lantern-mote'
    && EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD.activeSpecialist.id === 'fenbell-shepherd'
    && EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD.activeSpecialist.role === 'specialist'
    && EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD.activeSpecialist.status === 'implemented-full-approved'
    && JSON.stringify(EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD.deferredRoles) === JSON.stringify([
      { role: 'elite', status: 'planned-unnamed' },
    ]),
  'Will-o-Wisp role order or one-active-specialist boundary drifted',
);
check(
  EN_E07_FENBELL_SHEPHERD_CONTRACT.silhouette.includes('one visible guiding core eye')
    && EN_E07_FENBELL_SHEPHERD_CONTRACT.silhouette.includes('three connected lower flame tines')
    && EN_E07_FENBELL_SHEPHERD_CONTRACT.identity.includes('one opaque connected component')
    && EN_E07_FENBELL_SHEPHERD_DATA.bakedEffects.length === 0,
  'Fenbell Shepherd silhouette or external-effects firewall drifted',
);
check(
  ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E07')?.gate === 'queued',
  'isolated Fenbell Shepherd candidate must not advance the EN-E07 ledger',
);
check(
  EN_E07_FENBELL_SHEPHERD_REGISTRY.families.length === 1
    && EN_E07_FENBELL_SHEPHERD_REGISTRY.publicFamilies.length === 0
    && EN_E07_FENBELL_SHEPHERD_FAMILY.variants.length === 1,
  'Fenbell Shepherd isolated registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'will-o-wisp'),
  'Fenbell Shepherd must preserve public 80/259 and remain private',
);
check(engine.EN_E07_FENBELL_SHEPHERD_REGISTRY === undefined, 'Fenbell Shepherd must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(
  !publicSource.includes('enemy-expansion-en-e07-will-o-wisp-fenbell-shepherd')
    && !facadeSource.includes('enemy-expansion-en-e07-will-o-wisp-fenbell-shepherd')
    && !manifestSource.includes('fenbell-shepherd'),
  'Fenbell Shepherd public or fixture firewall drifted',
);

const captures = new Map();
const candidateRecords = [];
const lanternMoteRecords = [];
const spectralGhostRecords = [];
const flameElementalRecords = [];
const paletteSets = ['shell', 'flame', 'core', 'cage'].map((name) => [
  name,
  new Set(EN_E07_FENBELL_SHEPHERD_DATA.fenbellShepherd[name]),
]);
let connected = 0;
let bounded = 0;
let hovering = 0;
let colored = 0;
let flashes = 0;
let eyeFrames = 0;
let lanternMoteDifferences = 0;
let lanternMoteAlphaDifferences = 0;
let spectralGhostDifferences = 0;
let spectralGhostAlphaDifferences = 0;
let flameElementalDifferences = 0;
let flameElementalAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;
let minOpaque = Infinity;
let maxOpaque = 0;

for (const animation of animations) for (const direction of directions) {
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = frameKey(direction, animation.id, frame);
    const candidate = captureEnemyExpansionFrame(
      EN_E07_FENBELL_SHEPHERD_REGISTRY,
      candidateSpec,
      direction,
      animation.id,
      frame,
    );
    const lanternMote = captureEnemyExpansionFrame(
      EN_E07_LANTERN_MOTE_REGISTRY,
      lanternMoteSpec,
      direction,
      animation.id,
      frame,
    );
    const spectralGhost = captureLegacyFrame(spectralGhostSpec, direction, animation.id, frame);
    const flameElemental = captureLegacyFrame(flameElementalSpec, direction, animation.id, frame);
    captures.set(key, candidate);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    lanternMoteRecords.push(frameRecord(lanternMote, lanternMoteSpec, direction, animation.id, frame));
    spectralGhostRecords.push(frameRecord(spectralGhost, spectralGhostSpec, direction, animation.id, frame, false));
    flameElementalRecords.push(frameRecord(flameElemental, flameElementalSpec, direction, animation.id, frame, false));

    check(
      candidate.outOfBoundsWrites.length === 0
        && candidate.alpha.every((value) => value === 0 || value === 255),
      `${key} must stay in-cell with hard alpha`,
    );
    const isBounded = candidate.bounds
      && candidate.bounds.minX >= 1
      && candidate.bounds.minY >= 1
      && candidate.bounds.maxX <= 22
      && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++;
    else check(false, `${key} lost one-cell margin`);
    const isHovering = candidate.bounds && candidate.bounds.maxY >= 19 && candidate.bounds.maxY <= 21;
    if (isHovering) hovering++;
    else check(false, `${key} lost specialist hover clearance`);
    const componentCount = components(candidate.pixels);
    if (componentCount === 1) connected++;
    else check(false, `${key} has ${componentCount} opaque components`);
    check(
      candidate.opaquePixels >= 170 && candidate.opaquePixels <= 300,
      `${key} density ${candidate.opaquePixels} is implausible for a medium fen bell`,
    );
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(lanternMote.pixels)) lanternMoteDifferences++;
    if (candidate.alphaDigest !== lanternMote.alphaDigest) lanternMoteAlphaDifferences++;
    if (JSON.stringify(candidate.pixels) !== JSON.stringify(spectralGhost.pixels)) spectralGhostDifferences++;
    if (candidate.alphaDigest !== spectralGhost.alphaDigest) spectralGhostAlphaDifferences++;
    if (JSON.stringify(candidate.pixels) !== JSON.stringify(flameElemental.pixels)) flameElementalDifferences++;
    if (candidate.alphaDigest !== flameElemental.alphaDigest) flameElementalAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be an exact whole-actor white flash`);
      flashes++;
    } else {
      for (const [name, colors] of paletteSets) {
        check(countColors(candidate.pixels, colors) > 0, `${key} lost ${name} palette identity`);
      }
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_FENBELL_SHEPHERD_DATA.fenbellShepherd.eye]));
      if (direction === 'up') check(eyeCount === 0, `${key} rear view must not expose the guiding eye`);
      else {
        check(eyeCount === 1, `${key} must expose exactly one guiding eye, found ${eyeCount}`);
        if (eyeCount === 1) eyeFrames++;
      }
      colored++;
    }

    check(
      candidate.renderResult.fenbellShepherdGate === EN_E07_FENBELL_SHEPHERD_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_LANTERN_MOTE_GATE.id,
      `${key} gate metadata drifted`,
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E07_FENBELL_SHEPHERD_DATA);
    completeB += presentation.formComplete.reduce(
      (sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0),
      0,
    );
    formChanges += presentation.form.reduce(
      (sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0),
      0,
    );
  }
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  check(
    JSON.stringify(captures.get(frameKey('left', animation.id, frame)).pixels)
      === JSON.stringify(mirrorPixels(captures.get(frameKey('right', animation.id, frame)).pixels)),
    `side mirror drifted ${animation.id}/${frame}`,
  );
  check(
    captures.get(frameKey('down', animation.id, frame)).digest
      !== captures.get(frameKey('up', animation.id, frame)).digest,
    `Down/Up silhouette must differ ${animation.id}/${frame}`,
  );
}

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame++) {
    check(
      JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels)
        === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels),
      `${direction} Cast alias drifted C${frame + 1}`,
    );
    const source = EN_E07_FENBELL_SHEPHERD_DEATH_SOURCE_FRAMES[frame];
    check(
      JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels)
        === JSON.stringify(captures.get(frameKey(direction, 'hurt', source)).pixels),
      `${direction} Death alias drifted D${frame + 1}`,
    );
  }
  check(
    new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2,
    `${direction} Idle must have two distinct frames`,
  );
  check(
    new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4,
    `${direction} Walk must have four distinct frames`,
  );
  check(
    new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4,
    `${direction} Attack must have four distinct frames`,
  );
}

const candidateDigest = hashJson(candidateRecords);
const lanternMoteDigest = hashJson(lanternMoteRecords);
const spectralGhostDigest = hashJson(spectralGhostRecords);
const flameElementalDigest = hashJson(flameElementalRecords);
if (EN_E07_FENBELL_SHEPHERD_GATE.candidateFrameDigest) {
  check(candidateDigest === EN_E07_FENBELL_SHEPHERD_GATE.candidateFrameDigest, 'Fenbell Shepherd candidate digest drifted');
}
check(
  lanternMoteDigest === EN_E07_LANTERN_MOTE_GATE.candidateFrameDigest
    && lanternMoteDigest === EN_E07_FENBELL_SHEPHERD_GATE.lanternMoteComparisonDigest,
  'approved Lantern Mote predecessor pixels drifted',
);
if (EN_E07_FENBELL_SHEPHERD_GATE.spectralGhostComparisonDigest) {
  check(spectralGhostDigest === EN_E07_FENBELL_SHEPHERD_GATE.spectralGhostComparisonDigest, 'Spectral Ghost comparison digest drifted');
}
if (EN_E07_FENBELL_SHEPHERD_GATE.flameElementalComparisonDigest) {
  check(flameElementalDigest === EN_E07_FENBELL_SHEPHERD_GATE.flameElementalComparisonDigest, 'Flame Elemental comparison digest drifted');
}
check(
  lanternMoteDifferences === 80
    && lanternMoteAlphaDifferences === 80
    && spectralGhostDifferences === 80
    && spectralGhostAlphaDifferences === 80
    && flameElementalDifferences === 80
    && flameElementalAlphaDifferences === 80
    && connected === 80
    && bounded === 80
    && hovering === 80
    && colored === 72
    && flashes === 8
    && eyeFrames === 54,
  'suite totals drifted: Mote '
    + `${lanternMoteDifferences}/80 pixels ${lanternMoteAlphaDifferences}/80 alpha; Ghost `
    + `${spectralGhostDifferences}/80 pixels ${spectralGhostAlphaDifferences}/80 alpha; Flame `
    + `${flameElementalDifferences}/80 pixels ${flameElementalAlphaDifferences}/80 alpha; structure `
    + `${connected}/${bounded}/${hovering}; identity ${colored}/72 colored ${flashes}/8 flashes ${eyeFrames}/54 eyes`,
);
check(completeB > 0 && formChanges > 0, 'Complete B/Form presentation must change pixels');

const artifacts = [
  [EN_E07_FENBELL_SHEPHERD_GATE.artifact, EN_E07_FENBELL_SHEPHERD_GATE.artifactSha256],
  [EN_E07_FENBELL_SHEPHERD_GATE.assembledArtifact, EN_E07_FENBELL_SHEPHERD_GATE.assembledArtifactSha256],
  [EN_E07_FENBELL_SHEPHERD_GATE.comparisonArtifact, EN_E07_FENBELL_SHEPHERD_GATE.comparisonArtifactSha256],
  [EN_E07_FENBELL_SHEPHERD_GATE.reviewAnimations.raw.artifact, EN_E07_FENBELL_SHEPHERD_GATE.reviewAnimations.raw.sha256],
  [EN_E07_FENBELL_SHEPHERD_GATE.reviewAnimations.completeBForm.artifact, EN_E07_FENBELL_SHEPHERD_GATE.reviewAnimations.completeBForm.sha256],
];
for (const [artifact, expected] of artifacts) {
  if (expected) check(await sha256File(artifact) === expected, `${artifact} hash drifted`);
}

rejects(
  () => engine.renderEnemyExpansionFrame(
    EN_E07_FENBELL_SHEPHERD_REGISTRY,
    { kind: 'enemy', family: 'will-o-wisp', variant: 'elite-planned' },
    'down',
    'idle',
    0,
    {},
  ),
  'planned Will-o-Wisp elite',
);
for (const family of ['living-shadow', 'doppelganger', 'changeling', 'kelpie']) {
  rejects(
    () => engine.renderEnemyExpansionFrame(
      EN_E07_FENBELL_SHEPHERD_REGISTRY,
      { kind: 'enemy', family, variant: 'planned' },
      'down',
      'idle',
      0,
      {},
    ),
    family,
  );
}

if (errors.length) {
  console.error('EN-E07 Will-o-Wisp Fenbell Shepherd focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E07 Will-o-Wisp Fenbell Shepherd focused gate passed.');
console.log(`- Lantern Mote distinction: ${lanternMoteDifferences}/80 pixel frames and ${lanternMoteAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Spectral Ghost distinction: ${spectralGhostDifferences}/80 pixel frames and ${spectralGhostAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Flame Elemental distinction: ${flameElementalDifferences}/80 pixel frames and ${flameElementalAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connected}/80 connected; ${bounded}/80 bounded; ${hovering}/80 hovering; opaque range ${minOpaque}-${maxOpaque}`);
console.log(`- Style identity: ${colored}/72 colored palette frames; ${flashes}/8 exact white flashes; ${eyeFrames}/54 single-eye views`);
console.log(`- Presentation: Complete B +${completeB}; Form changes ${formChanges}`);
console.log('- Protected: approved Lantern Mote exact; public 80/259; fixtures unchanged');
console.log(`- Candidate digest: ${candidateDigest}`);
console.log(`- Approved Lantern Mote frame digest: ${lanternMoteDigest}`);
console.log(`- Public Spectral Ghost frame digest: ${spectralGhostDigest}`);
console.log(`- Public Flame Elemental frame digest: ${flameElementalDigest}`);
