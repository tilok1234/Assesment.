import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E03_CONTRACT_CARDS,
  EN_E03_IDLE_FAMILIES,
  EN_E03_IDLE_GATE,
  EN_E03_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
  mirrorPixels,
  pixelDigest,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const cardOrder = ['giant', 'centaur', 'satyr'];
const registryOrder = ['centaur', 'giant', 'satyr'];
const expectedBaselines = {
  giant: 'hill-breaker',
  centaur: 'steppe-hunter',
  satyr: 'briar-reveler',
};
const expectedModes = {
  giant: 'large-bipedal',
  centaur: 'hybrid-quadrupedal',
  satyr: 'digitigrade-bipedal',
};

function check(condition, message) {
  if (!condition) errors.push(message);
}

function rejects(run, messageFragment, label) {
  try {
    run();
    errors.push(label + ' was not rejected.');
  } catch (error) {
    check(String(error.message).includes(messageFragment), label + ' returned the wrong error: ' + error.message);
  }
}

function pixelAt(rendered, x, y) {
  return rendered.pixels[(y * engine.SIZE) + x];
}

function componentCount(pixels) {
  const visited = new Uint8Array(pixels.length);
  let count = 0;
  for (let start = 0; start < pixels.length; start++) {
    if (pixels[start] === null || visited[start]) continue;
    count++;
    const queue = [start];
    visited[start] = 1;
    while (queue.length) {
      const index = queue.pop();
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= engine.SIZE || ny >= engine.SIZE) continue;
        const next = (ny * engine.SIZE) + nx;
        if (visited[next] || pixels[next] === null) continue;
        visited[next] = 1;
        queue.push(next);
      }
    }
  }
  return count;
}

check(JSON.stringify(EN_E03_CONTRACT_CARDS.map((card) => card.id)) === JSON.stringify(cardOrder), 'contract cards must retain the authorized Giant, Centaur, Satyr review order');
check(Object.isFrozen(EN_E03_CONTRACT_CARDS) && EN_E03_CONTRACT_CARDS.every(Object.isFrozen), 'EN-E03 contract cards must be deeply immutable');
check(EN_E03_CONTRACT_CARDS.length === 3, 'EN-E03 needs exactly three contract cards');
check(EN_E03_IDLE_GATE.status === 'awaiting-designer-approval', 'the EN-E03 Idle gate must remain pending explicit visual approval');
check(EN_E03_IDLE_GATE.authorizedOn === '2026-08-03', 'the EN-E03 Idle gate must record the authorization date');
check(EN_E03_IDLE_GATE.artifact === 'enemy-expansion-review/en-e03/en-e03-idle-review.png', 'the EN-E03 Idle gate must use the isolated review artifact path');
check(EN_E03_IDLE_GATE.revision === 'v2-roster-style-rebuild', 'the EN-E03 Idle gate must identify the roster-style rebuild');
check(EN_E03_IDLE_GATE.replacesRejectedCandidate?.candidateFrameDigest === 'd7ed44c51002873fb12045317af13f16b76cbdeed647a2968537b017f5e933ad', 'the EN-E03 Idle gate must retain the rejected v1 digest as historical evidence');
check(EN_E03_IDLE_GATE.artifactSha256 === '059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2', 'the EN-E03 Idle gate must freeze the exact rebuilt raw review hash');
check(EN_E03_IDLE_GATE.assembledArtifactSha256 === '2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89', 'the EN-E03 Idle gate must freeze the exact rebuilt Complete B + Form review hash');
check(EN_E03_IDLE_GATE.exclusions.includes('Walk') && EN_E03_IDLE_GATE.exclusions.includes('registration'), 'the EN-E03 Idle gate must exclude later motion and registration');
check(Object.isFrozen(EN_E03_IDLE_GATE) && Object.isFrozen(EN_E03_IDLE_GATE.exclusions), 'the EN-E03 Idle gate must be deeply immutable');

for (const card of EN_E03_CONTRACT_CARDS) {
  const prefix = 'Contract ' + card.id;
  check(card.sliceId === 'EN-E03', prefix + ' must belong to EN-E03');
  check(card.intendedScale?.cell === engine.SIZE && card.intendedScale?.footprint === 'one-cell-margin', prefix + ' must preserve the 24x24 one-cell-margin contract');
  check(card.intendedScale?.class && card.intendedScale?.heightRead, prefix + ' needs explicit scale and silhouette guidance');
  check(card.locomotion?.mode === expectedModes[card.id], prefix + ' has the wrong locomotion mode');
  check(card.locomotion?.stance && card.locomotion?.idle && card.locomotion?.walk, prefix + ' needs complete stance, Idle, and future-walk boundaries');
  check(card.attackTell?.bodyCue && card.attackTell?.heldItemCue, prefix + ' needs body and held-item attack tells');
  check(Array.isArray(card.attackTell?.externalized) && card.attackTell.externalized.length > 0, prefix + ' must identify externalized attack content');
  check(Array.isArray(card.externalEffects) && card.externalEffects.length > 0, prefix + ' must list external effect contracts');
  check(Array.isArray(card.externalMechanics) && card.externalMechanics.length > 0, prefix + ' must list external mechanics');
  check(card.variantBriefs?.length === 3, prefix + ' needs common, specialist, and elite briefs');
  check(JSON.stringify(card.variantBriefs.map((variant) => variant.role)) === JSON.stringify(['common', 'specialist', 'elite']), prefix + ' variant roles must be common, specialist, elite');
  check(new Set(card.variantBriefs.map((variant) => variant.id)).size === 3, prefix + ' variant ids must be unique');
  check(card.variantBriefs.every((variant) => variant.name && variant.brief), prefix + ' every variant needs a name and production brief');
  check(card.baseline?.variantId === expectedBaselines[card.id], prefix + ' has the wrong baseline variant');
  check(card.variantBriefs[0].id === card.baseline?.variantId, prefix + ' must implement only its common brief first');
  check(card.baseline?.rendererData?.archetype === card.id, prefix + ' must select its data-driven chassis archetype');
  check(Object.keys(card.baseline?.rendererData?.actor?.palette || {}).length === 3, prefix + ' needs skin, hair, and outfit Form ramps');
  check(Object.keys(card.baseline?.rendererData?.materials || {}).length === 4, prefix + ' needs hide, hoof, wood, and accent material ramps');
}

check(EN_E03_IDLE_FAMILIES.length === 3, 'the EN-E03 Idle definitions must contain three internal families');
check(JSON.stringify(EN_E03_IDLE_REGISTRY.families.map((family) => family.id)) === JSON.stringify(registryOrder), 'the EN-E03 Idle registry must use deterministic family-id order');
check(EN_E03_IDLE_REGISTRY.renderers.length === 1, 'EN-E03 must use one large-hybrid renderer');
check(EN_E03_IDLE_REGISTRY.renderers[0].key === 'large-hybrid-v2', 'EN-E03 must use the versioned large-hybrid renderer');
check(EN_E03_IDLE_REGISTRY.renderers[0].chassis === 'large-hybrid-v2', 'EN-E03 must declare the large-hybrid-v2 chassis');
check(EN_E03_IDLE_REGISTRY.publicFamilies.length === 0 && EN_E03_IDLE_REGISTRY.approvedFamilies.length === 0, 'EN-E03 Idle evidence must not enter the public family view');
check(Object.isFrozen(EN_E03_IDLE_REGISTRY), 'the EN-E03 Idle registry must be immutable');
check(engine.ENEMY_EXPANSION_REGISTRY.publicFamilies.length === 17, 'EN-E03 Idle work must remain excluded while later EN-E05 registration brings the stable registry to seventeen approved families');
check(engine.PUBLIC_ENEMIES.length === 70, 'EN-E03 Idle work must not alter the 70-family consumer catalog');
check(engine.ENEMIES.length === 57, 'EN-E03 Idle work must not alter the legacy Enemy catalog');
check(cardOrder.every((id) => !engine.PUBLIC_ENEMIES.some((family) => family.id === id)), 'EN-E03 families must remain absent from generic consumers');

for (const family of EN_E03_IDLE_REGISTRY.families) {
  check(family.state === engine.ENEMY_EXPANSION_STATES.IMPLEMENTED, 'Candidate ' + family.id + ' must remain implemented, not approved');
  check(family.variants.length === 1, 'Candidate ' + family.id + ' must register only its common baseline');
  check(family.variants[0].id === expectedBaselines[family.id], 'Candidate ' + family.id + ' registered the wrong baseline');
}

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03'), 'the public facade must not import EN-E03 implementation details');
check(!facadeSource.includes('EN_E03_'), 'the public facade must not expose EN-E03 implementation symbols');

const reviewPlan = engine.buildEnemyExpansionReviewPlan(EN_E03_IDLE_REGISTRY, { sliceId: 'EN-E03' });
check(JSON.stringify(reviewPlan.families.map((family) => family.id)) === JSON.stringify(registryOrder), 'slice review targeting must select the three EN-E03 candidates deterministically');
check(reviewPlan.families.every((family) => family.state === engine.ENEMY_EXPANSION_STATES.IMPLEMENTED), 'review-plan families must remain implemented candidates');
check(reviewPlan.frames.length === 8, 'the EN-E03 gate must contain two Idle frames in four directions');
check(
  JSON.stringify(reviewPlan.frames) === JSON.stringify(engine.DIRS.flatMap((direction) => [
    { direction, animation: 'idle', frame: 0 },
    { direction, animation: 'idle', frame: 1 },
  ])),
  'the EN-E03 review frame order must be Down, Left, Right, Up with two Idle frames each',
);
check(JSON.stringify(reviewPlan) === JSON.stringify(engine.buildEnemyExpansionReviewPlan(EN_E03_IDLE_REGISTRY, { sliceId: 'EN-E03' })), 'the EN-E03 review plan must be deterministic');

const frameRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
const occupancy = new Map();
for (const card of EN_E03_CONTRACT_CARDS) {
  const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
  const directionMasks = new Map();
  let familyOpaque = 0;
  for (const direction of engine.DIRS) {
    const idleFrames = [];
    for (let frame = 0; frame < 2; frame++) {
      const rendered = captureEnemyExpansionFrame(EN_E03_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
      const repeated = captureEnemyExpansionFrame(EN_E03_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
      const prefix = card.id + '/' + direction + '/idle/' + frame;
      check(rendered.digest === repeated.digest, prefix + ' must render deterministically');
      check(rendered.opaquePixels > 0, prefix + ' must not be empty');
      check(rendered.outOfBoundsWrites.length === 0, prefix + ' attempted out-of-bounds drawing');
      check(rendered.colors.every((entry) => /^#[0-9a-f]{6}$/i.test(entry)), prefix + ' must use opaque six-digit colors only');
      check([...rendered.alpha].every((alpha) => alpha === 0 || alpha === 255), prefix + ' must use binary alpha');
      check(rendered.bounds && rendered.bounds.minX >= 1 && rendered.bounds.maxX <= 22 && rendered.bounds.minY >= 1 && rendered.bounds.maxY <= 22, prefix + ' must retain a one-cell canvas margin');
      check(rendered.renderResult?.family === card.id && rendered.renderResult?.variant === card.baseline.variantId, prefix + ' returned the wrong renderer evidence');
      check(rendered.renderResult?.archetype === card.id, prefix + ' returned the wrong chassis archetype');
      check(componentCount(rendered.pixels) === 1, prefix + ' contains a detached body, weapon, tail, or hoof component');

      const presentation = buildEnemyExpansionCandidatePresentation(rendered.pixels, card.baseline.rendererData);
      const addedOutline = presentation.complete.reduce((total, entry, index) => total + Number(rendered.pixels[index] === null && entry !== null), 0);
      const changedForm = presentation.form.reduce((total, entry, index) => total + Number(rendered.pixels[index] !== null && entry !== rendered.pixels[index]), 0);
      check(addedOutline > 0, prefix + ' must gain a Complete B exterior outline');
      check(changedForm > 0, prefix + ' must gain visible Form shading');
      check(presentation.complete.every((entry, index) => rendered.pixels[index] === null || entry === rendered.pixels[index]), prefix + ' Complete B must preserve every raw source pixel');
      check(presentation.formComplete.every((entry, index) => rendered.pixels[index] !== null || entry === presentation.complete[index]), prefix + ' Form must not rewrite Complete B outline pixels');
      completeOutlinePixels += addedOutline;
      formChangedPixels += changedForm;
      familyOpaque += rendered.opaquePixels;
      idleFrames.push(rendered);
      frameRecords.push({
        family: card.id,
        variant: card.baseline.variantId,
        direction,
        animation: 'idle',
        frame,
        digest: rendered.digest,
        alphaDigest: rendered.alphaDigest,
        opaquePixels: rendered.opaquePixels,
        bounds: rendered.bounds,
      });
    }
    check(idleFrames[0].digest !== idleFrames[1].digest, card.id + '/' + direction + ' needs visible two-frame Idle motion');
    check(idleFrames[0].alphaDigest !== idleFrames[1].alphaDigest, card.id + '/' + direction + ' needs a silhouette-level Idle shift');
    directionMasks.set(direction, idleFrames[0].alphaDigest);
  }
  occupancy.set(card.id, familyOpaque);
  check(new Set(directionMasks.values()).size >= 3, card.id + ' needs readable front, side, and rear Idle silhouettes');
}

for (const card of EN_E03_CONTRACT_CARDS) for (let frame = 0; frame < 2; frame++) {
  const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
  const right = captureEnemyExpansionFrame(EN_E03_IDLE_REGISTRY, spec, 'right', 'idle', frame, engine.SIZE);
  const left = captureEnemyExpansionFrame(EN_E03_IDLE_REGISTRY, spec, 'left', 'idle', frame, engine.SIZE);
  check(pixelDigest(mirrorPixels(right.pixels, engine.SIZE)) === left.digest, card.id + '/idle/' + frame + ' left pixels must exactly mirror the right pixels');
  check(right.opaquePixels === left.opaquePixels, card.id + '/idle/' + frame + ' side views must retain equal occupied area');
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const silhouettes = EN_E03_CONTRACT_CARDS.map((card) => {
    const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
    return alphaDigest(captureEnemyExpansionFrame(EN_E03_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE).pixels);
  });
  check(new Set(silhouettes).size === EN_E03_CONTRACT_CARDS.length, direction + '/idle/' + frame + ' must keep Giant, Centaur, and Satyr silhouettes distinct');
}

const centaurSide = captureEnemyExpansionFrame(EN_E03_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'right', 'idle', 0, engine.SIZE);
for (const x of [5, 9, 16, 19]) check(pixelAt(centaurSide, x, 22) !== null, 'Centaur right Idle must expose all four grounded hoof contacts');
check(centaurSide.bounds.minX === 1 && centaurSide.bounds.maxX === 22, 'Centaur right Idle must use a long horizontal hybrid silhouette');
check(pixelAt(centaurSide, 13, 11) !== null && pixelAt(centaurSide, 13, 12) !== null, 'Centaur human/horse join must remain opaque at the withers');

const giantDown = captureEnemyExpansionFrame(EN_E03_IDLE_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'idle', 0, engine.SIZE);
check(giantDown.bounds.minY === 2 && giantDown.bounds.maxY === 22, 'Giant Down Idle must read near full cell height');
check(occupancy.get('giant') > occupancy.get('satyr'), 'Giant must remain materially broader/heavier than Satyr across the Idle corpus');

const satyrDown = captureEnemyExpansionFrame(EN_E03_IDLE_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' }, 'down', 'idle', 0, engine.SIZE);
for (const x of [6, 8, 15, 17]) check(pixelAt(satyrDown, x, 22) !== null, 'Satyr Down Idle must expose split digitigrade hoof contacts');

rejects(
  () => engine.renderEnemyExpansionFrame(
    EN_E03_IDLE_REGISTRY,
    { kind: 'enemy', family: 'giant', variant: 'hill-breaker' },
    'down',
    'walk',
    0,
    { clearRect() {}, fillRect() {}, fillStyle: '#000000' },
  ),
  'currently authorizes Idle only',
  'EN-E03 pre-approval Walk rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(
    EN_E03_IDLE_REGISTRY,
    { kind: 'enemy', family: 'centaur', variant: 'sun-lancer' },
    'down',
    'idle',
    0,
    { clearRect() {}, fillRect() {}, fillStyle: '#000000' },
  ),
  'is not implemented',
  'EN-E03 specialist rendering',
);

const ledgerReport = engine.buildEnemyExpansionLedgerReport(engine.ENEMY_EXPANSION_LEDGER, EN_E03_IDLE_REGISTRY);
check(ledgerReport.counts.approved === 5 && ledgerReport.counts.implemented === 0 && ledgerReport.counts.planned === 17, 'current ledger must retain five approved, zero implemented, and seventeen planned slices');
check(ledgerReport.counts.registeredFamilies === 3 && ledgerReport.counts.publicFamilies === 0, 'EN-E03 evidence must report three internal and zero public families');
const enE03Slice = ledgerReport.slices.find((slice) => slice.id === 'EN-E03');
check(enE03Slice?.state === engine.ENEMY_EXPANSION_STATES.PLANNED && enE03Slice?.gate === 'idle-authorized-2026-08-03', 'the EN-E03 ledger entry must remain planned but record Idle authorization');
check(enE03Slice?.registeredFamilies === 3 && enE03Slice?.publicFamilies === 0, 'the EN-E03 ledger evidence must expose only three internal common baselines');

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(candidateDigest === EN_E03_IDLE_GATE.candidateFrameDigest, 'EN-E03 Idle frame digest drifted from the frozen review gate');

if (errors.length) {
  console.error('EN-E03 Idle candidate validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 common-only Idle candidate validation passed.');
console.log('- Contract cards: 3 (Giant / Centaur / Satyr)');
console.log('- Implemented variants: 3 common / 0 specialist / 0 elite');
console.log('- Reviewed frames: ' + frameRecords.length + ' (4 directions x 2 Idle frames x 3 families)');
console.log('- Connected silhouettes: 24 / 24');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
