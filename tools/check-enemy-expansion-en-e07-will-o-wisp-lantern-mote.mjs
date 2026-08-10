import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import * as engine from '../sprite-engine.js';
import { ENEMY_EXPANSION_LEDGER } from '../engine/enemy-expansion.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E07_GRAND_PRETENDER_GATE,
  EN_E07_GRAND_PRETENDER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-doppelganger-grand-pretender.js';
import {
  EN_E07_LANTERN_MOTE_CONTRACT,
  EN_E07_LANTERN_MOTE_DATA,
  EN_E07_LANTERN_MOTE_DEATH_SOURCE_FRAMES,
  EN_E07_LANTERN_MOTE_FAMILY,
  EN_E07_LANTERN_MOTE_GATE,
  EN_E07_LANTERN_MOTE_REGISTRY,
  EN_E07_WILL_O_WISP_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e07-will-o-wisp-lantern-mote.js';
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
const candidateSpec = { kind: 'enemy', family: 'will-o-wisp', variant: 'lantern-mote' };
const spectralGhostSpec = { kind: 'enemy', family: 'ghost', variant: 'spectral' };
const shadowSlimeSpec = { kind: 'enemy', family: 'slime', variant: 'shadow' };
const flameElementalSpec = { kind: 'enemy', family: 'elemental', variant: 'flame' };
const grandPretenderSpec = { kind: 'enemy', family: 'doppelganger', variant: 'grand-pretender' };
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
  EN_E07_LANTERN_MOTE_GATE.status === 'candidate'
    && EN_E07_LANTERN_MOTE_GATE.approvedOn === null
    && EN_E07_LANTERN_MOTE_GATE.publishedImplementation === null,
  'Lantern Mote must remain an unapproved private candidate',
);
check(
  EN_E07_LANTERN_MOTE_GATE.baseCheckpoint === '3ddbe159360f16844d167ecc753d6b767b7e5549'
    && EN_E07_LANTERN_MOTE_GATE.authorizationEvidence.includes('designer replied: Approved lets do next')
    && EN_E07_LANTERN_MOTE_GATE.authorizationEvidence.includes('only one private common Will-o-Wisp Lantern Mote'),
  'Lantern Mote authorization or base checkpoint drifted',
);
check(
  EN_E07_LANTERN_MOTE_GATE.precedingApproval.gateId === EN_E07_GRAND_PRETENDER_GATE.id
    && EN_E07_LANTERN_MOTE_GATE.precedingApproval.candidateFrameDigest === EN_E07_GRAND_PRETENDER_GATE.candidateFrameDigest
    && EN_E07_LANTERN_MOTE_GATE.precedingApproval.publishedImplementation === EN_E07_GRAND_PRETENDER_GATE.publishedImplementation
    && EN_E07_LANTERN_MOTE_GATE.precedingApproval.publishedApprovalRecord === EN_E07_GRAND_PRETENDER_GATE.publishedApprovalRecord
    && EN_E07_LANTERN_MOTE_GATE.precedingApproval.currentReconciliation === '3ddbe159360f16844d167ecc753d6b767b7e5549'
    && EN_E07_LANTERN_MOTE_GATE.precedingApproval.reconciliationPublication === 'published',
  'Grand Pretender predecessor publication tuple drifted',
);
check(
  EN_E07_LANTERN_MOTE_GATE.scope.includes('complete 80-frame Lantern Mote common')
    && EN_E07_LANTERN_MOTE_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E07_LANTERN_MOTE_GATE.animationContract.includes('Death aliases Hurt H1,H2,H2,H2'),
  'Lantern Mote full-suite contract drifted',
);
check(
  EN_E07_LANTERN_MOTE_GATE.exclusions.includes('public Will-o-Wisp registration')
    && EN_E07_LANTERN_MOTE_GATE.exclusions.includes('asset-pack fixture generation or regeneration')
    && EN_E07_LANTERN_MOTE_GATE.exclusions.includes('Will-o-Wisp specialist or elite')
    && EN_E07_LANTERN_MOTE_GATE.exclusions.includes('Changeling')
    && EN_E07_LANTERN_MOTE_GATE.exclusions.includes('Kelpie')
    && EN_E07_LANTERN_MOTE_GATE.exclusions.includes('EN-E08 and later work'),
  'Lantern Mote exclusions drifted',
);
check(
  EN_E07_LANTERN_MOTE_GATE.nextGate.includes('Do not commit')
    && EN_E07_LANTERN_MOTE_GATE.nextGate.includes('designer explicitly approves'),
  'Lantern Mote approval stop gate drifted',
);
check(
  Object.isFrozen(EN_E07_LANTERN_MOTE_GATE)
    && Object.isFrozen(EN_E07_LANTERN_MOTE_DATA)
    && Object.isFrozen(EN_E07_WILL_O_WISP_CONTRACT_CARD),
  'Lantern Mote gate, data, and family card must be deeply immutable',
);
check(
  JSON.stringify(EN_E07_WILL_O_WISP_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E07_WILL_O_WISP_CONTRACT_CARD.activeVariant.id === 'lantern-mote'
    && EN_E07_WILL_O_WISP_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E07_WILL_O_WISP_CONTRACT_CARD.activeVariant.status === 'implemented-full-candidate'
    && JSON.stringify(EN_E07_WILL_O_WISP_CONTRACT_CARD.deferredRoles) === JSON.stringify([
      { role: 'specialist', status: 'planned-unnamed' },
      { role: 'elite', status: 'planned-unnamed' },
    ]),
  'Will-o-Wisp role order or one-active-role boundary drifted',
);
check(
  EN_E07_LANTERN_MOTE_CONTRACT.silhouette.includes('single visible core eye')
    && EN_E07_LANTERN_MOTE_CONTRACT.silhouette.includes('two connected lower flame prongs')
    && EN_E07_LANTERN_MOTE_CONTRACT.identity.includes('one opaque connected component')
    && EN_E07_LANTERN_MOTE_DATA.bakedEffects.length === 0,
  'Lantern Mote silhouette or external-effects firewall drifted',
);
check(
  ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E07')?.gate === 'queued',
  'isolated Lantern Mote candidate must not advance the EN-E07 ledger',
);
check(
  EN_E07_LANTERN_MOTE_REGISTRY.families.length === 1
    && EN_E07_LANTERN_MOTE_REGISTRY.publicFamilies.length === 0
    && EN_E07_LANTERN_MOTE_FAMILY.variants.length === 1,
  'Lantern Mote isolated registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'will-o-wisp'),
  'Lantern Mote must preserve public 80/259 and remain private',
);
check(engine.EN_E07_LANTERN_MOTE_REGISTRY === undefined, 'Lantern Mote must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(
  !publicSource.includes('enemy-expansion-en-e07-will-o-wisp-lantern-mote')
    && !facadeSource.includes('enemy-expansion-en-e07-will-o-wisp-lantern-mote')
    && !manifestSource.includes('lantern-mote'),
  'Lantern Mote public or fixture firewall drifted',
);

const captures = new Map();
const candidateRecords = [];
const spectralGhostRecords = [];
const shadowSlimeRecords = [];
const flameElementalRecords = [];
const paletteSets = ['shell', 'flame', 'core', 'cage'].map((name) => [
  name,
  new Set(EN_E07_LANTERN_MOTE_DATA.lanternMote[name]),
]);
let connected = 0;
let bounded = 0;
let hovering = 0;
let colored = 0;
let flashes = 0;
let eyeFrames = 0;
let spectralGhostDifferences = 0;
let spectralGhostAlphaDifferences = 0;
let shadowSlimeDifferences = 0;
let shadowSlimeAlphaDifferences = 0;
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
      EN_E07_LANTERN_MOTE_REGISTRY,
      candidateSpec,
      direction,
      animation.id,
      frame,
    );
    const spectralGhost = captureLegacyFrame(spectralGhostSpec, direction, animation.id, frame);
    const shadowSlime = captureLegacyFrame(shadowSlimeSpec, direction, animation.id, frame);
    const flameElemental = captureLegacyFrame(flameElementalSpec, direction, animation.id, frame);
    captures.set(key, candidate);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    spectralGhostRecords.push(frameRecord(spectralGhost, spectralGhostSpec, direction, animation.id, frame, false));
    shadowSlimeRecords.push(frameRecord(shadowSlime, shadowSlimeSpec, direction, animation.id, frame, false));
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
    const isHovering = candidate.bounds && candidate.bounds.maxY >= 18 && candidate.bounds.maxY <= 20;
    if (isHovering) hovering++;
    else check(false, `${key} lost true hover clearance`);
    const componentCount = components(candidate.pixels);
    if (componentCount === 1) connected++;
    else check(false, `${key} has ${componentCount} opaque components`);
    check(
      candidate.opaquePixels >= 90 && candidate.opaquePixels <= 240,
      `${key} density ${candidate.opaquePixels} is implausible for a small marsh lantern`,
    );
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(spectralGhost.pixels)) spectralGhostDifferences++;
    if (candidate.alphaDigest !== spectralGhost.alphaDigest) spectralGhostAlphaDifferences++;
    if (JSON.stringify(candidate.pixels) !== JSON.stringify(shadowSlime.pixels)) shadowSlimeDifferences++;
    if (candidate.alphaDigest !== shadowSlime.alphaDigest) shadowSlimeAlphaDifferences++;
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
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_LANTERN_MOTE_DATA.lanternMote.eye]));
      if (direction === 'up') check(eyeCount === 0, `${key} rear view must not expose the core eye`);
      else {
        check(eyeCount === 1, `${key} must expose exactly one core eye, found ${eyeCount}`);
        if (eyeCount === 1) eyeFrames++;
      }
      colored++;
    }

    check(
      candidate.renderResult.lanternMoteGate === EN_E07_LANTERN_MOTE_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_GRAND_PRETENDER_GATE.id,
      `${key} gate metadata drifted`,
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E07_LANTERN_MOTE_DATA);
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
    const source = EN_E07_LANTERN_MOTE_DEATH_SOURCE_FRAMES[frame];
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
const spectralGhostDigest = hashJson(spectralGhostRecords);
const shadowSlimeDigest = hashJson(shadowSlimeRecords);
const flameElementalDigest = hashJson(flameElementalRecords);
if (EN_E07_LANTERN_MOTE_GATE.candidateFrameDigest) {
  check(candidateDigest === EN_E07_LANTERN_MOTE_GATE.candidateFrameDigest, 'Lantern Mote candidate digest drifted');
}
if (EN_E07_LANTERN_MOTE_GATE.spectralGhostComparisonDigest) {
  check(spectralGhostDigest === EN_E07_LANTERN_MOTE_GATE.spectralGhostComparisonDigest, 'Spectral Ghost comparison digest drifted');
}
if (EN_E07_LANTERN_MOTE_GATE.shadowSlimeComparisonDigest) {
  check(shadowSlimeDigest === EN_E07_LANTERN_MOTE_GATE.shadowSlimeComparisonDigest, 'Shadow Slime comparison digest drifted');
}
if (EN_E07_LANTERN_MOTE_GATE.flameElementalComparisonDigest) {
  check(flameElementalDigest === EN_E07_LANTERN_MOTE_GATE.flameElementalComparisonDigest, 'Flame Elemental comparison digest drifted');
}

const grandPretenderRecords = [];
for (const animation of animations) for (const direction of directions) {
  for (let frame = 0; frame < animation.frames; frame++) {
    const captured = captureEnemyExpansionFrame(
      EN_E07_GRAND_PRETENDER_REGISTRY,
      grandPretenderSpec,
      direction,
      animation.id,
      frame,
    );
    grandPretenderRecords.push(frameRecord(captured, grandPretenderSpec, direction, animation.id, frame));
  }
}
const grandPretenderDigest = hashJson(grandPretenderRecords);
check(
  grandPretenderDigest === EN_E07_GRAND_PRETENDER_GATE.candidateFrameDigest
    && grandPretenderDigest === EN_E07_LANTERN_MOTE_GATE.grandPretenderPredecessorDigest,
  'approved Grand Pretender predecessor pixels drifted',
);

check(
  spectralGhostDifferences === 80
    && spectralGhostAlphaDifferences === 80
    && shadowSlimeDifferences === 80
    && shadowSlimeAlphaDifferences === 80
    && flameElementalDifferences === 80
    && flameElementalAlphaDifferences === 80
    && connected === 80
    && bounded === 80
    && hovering === 80
    && colored === 72
    && flashes === 8
    && eyeFrames === 54,
  'suite totals drifted: Ghost '
    + `${spectralGhostDifferences}/80 pixels ${spectralGhostAlphaDifferences}/80 alpha; Slime `
    + `${shadowSlimeDifferences}/80 pixels ${shadowSlimeAlphaDifferences}/80 alpha; Flame `
    + `${flameElementalDifferences}/80 pixels ${flameElementalAlphaDifferences}/80 alpha; structure `
    + `${connected}/${bounded}/${hovering}; identity ${colored}/72 colored ${flashes}/8 flashes ${eyeFrames}/54 eyes`,
);
check(completeB > 0 && formChanges > 0, 'Complete B/Form presentation must change pixels');

const artifacts = [
  [EN_E07_LANTERN_MOTE_GATE.artifact, EN_E07_LANTERN_MOTE_GATE.artifactSha256],
  [EN_E07_LANTERN_MOTE_GATE.assembledArtifact, EN_E07_LANTERN_MOTE_GATE.assembledArtifactSha256],
  [EN_E07_LANTERN_MOTE_GATE.comparisonArtifact, EN_E07_LANTERN_MOTE_GATE.comparisonArtifactSha256],
  [EN_E07_LANTERN_MOTE_GATE.reviewAnimations.raw.artifact, EN_E07_LANTERN_MOTE_GATE.reviewAnimations.raw.sha256],
  [EN_E07_LANTERN_MOTE_GATE.reviewAnimations.completeBForm.artifact, EN_E07_LANTERN_MOTE_GATE.reviewAnimations.completeBForm.sha256],
];
for (const [artifact, expected] of artifacts) {
  if (expected) check(await sha256File(artifact) === expected, `${artifact} hash drifted`);
}

for (const variant of ['specialist-planned', 'elite-planned']) {
  rejects(
    () => engine.renderEnemyExpansionFrame(
      EN_E07_LANTERN_MOTE_REGISTRY,
      { kind: 'enemy', family: 'will-o-wisp', variant },
      'down',
      'idle',
      0,
      {},
    ),
    `planned Will-o-Wisp ${variant}`,
  );
}
for (const family of ['living-shadow', 'doppelganger', 'changeling', 'kelpie']) {
  rejects(
    () => engine.renderEnemyExpansionFrame(
      EN_E07_LANTERN_MOTE_REGISTRY,
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
  console.error('EN-E07 Will-o-Wisp Lantern Mote focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E07 Will-o-Wisp Lantern Mote focused gate passed.');
console.log(`- Spectral Ghost distinction: ${spectralGhostDifferences}/80 pixel frames and ${spectralGhostAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Shadow Slime distinction: ${shadowSlimeDifferences}/80 pixel frames and ${shadowSlimeAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Flame Elemental distinction: ${flameElementalDifferences}/80 pixel frames and ${flameElementalAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connected}/80 connected; ${bounded}/80 bounded; ${hovering}/80 hovering; opaque range ${minOpaque}-${maxOpaque}`);
console.log(`- Style identity: ${colored}/72 colored palette frames; ${flashes}/8 exact white flashes; ${eyeFrames}/54 single-eye views`);
console.log(`- Presentation: Complete B +${completeB}; Form changes ${formChanges}`);
console.log('- Protected: approved Grand Pretender exact; public 80/259; fixtures unchanged');
console.log(`- Candidate digest: ${candidateDigest}`);
console.log(`- Public Spectral Ghost frame digest: ${spectralGhostDigest}`);
console.log(`- Public Shadow Slime frame digest: ${shadowSlimeDigest}`);
console.log(`- Public Flame Elemental frame digest: ${flameElementalDigest}`);
