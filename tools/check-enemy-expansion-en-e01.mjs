import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E01_CONTRACT_CARDS,
  EN_E01_IDLE_GATE,
  EN_E01_IDLE_FAMILIES,
  EN_E01_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e01.js';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
  mirrorPixels,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

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

const cardOrder = ['witch', 'fallen-knight', 'pirate', 'necromancer', 'alchemist'];
const registryOrder = ['alchemist', 'fallen-knight', 'necromancer', 'pirate', 'witch'];
const expectedBaselines = {
  witch: 'hexer',
  'fallen-knight': 'shieldbearer',
  pirate: 'deckhand',
  necromancer: 'bone-caller',
  alchemist: 'flask-thrower',
};

check(JSON.stringify(EN_E01_CONTRACT_CARDS.map((card) => card.id)) === JSON.stringify(cardOrder), 'contract cards must retain the approved EN-E01 review order');
check(Object.isFrozen(EN_E01_CONTRACT_CARDS) && EN_E01_CONTRACT_CARDS.every(Object.isFrozen), 'EN-E01 contract cards must be deeply immutable');
check(EN_E01_CONTRACT_CARDS.length === 5, 'EN-E01 needs exactly five contract cards');
check(EN_E01_IDLE_GATE.status === 'approved' && EN_E01_IDLE_GATE.approvedOn === '2026-08-02', 'the exact EN-E01 Idle review must record designer approval');
check(EN_E01_IDLE_GATE.artifactSha256 === '2d710ab54a845c4805d428c428cfa9e1cda09f4adee886c5deafbafee831b7ee', 'the approved EN-E01 Idle PNG hash drifted');
check(EN_E01_IDLE_GATE.candidateFrameDigest === '339c5ff809d3b17aec20b3ec953c8217470cde026fc743cde0cd3854ed5c3323', 'the approved 40-frame Idle digest drifted');
check(Object.isFrozen(EN_E01_IDLE_GATE), 'the EN-E01 Idle approval record must be immutable');

for (const card of EN_E01_CONTRACT_CARDS) {
  const prefix = 'Contract ' + card.id;
  check(card.sliceId === 'EN-E01', prefix + ' must belong to EN-E01');
  check(card.intendedScale?.cell === engine.SIZE && card.intendedScale?.footprint === 'one-cell-margin', prefix + ' must preserve the 24x24 one-cell-margin contract');
  check(card.locomotion?.mode === 'bipedal' && card.locomotion?.stance && card.locomotion?.idle, prefix + ' needs a complete locomotion brief');
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
}

check(EN_E01_IDLE_FAMILIES.length === 5, 'the approved Idle family definitions must contain five families');
check(JSON.stringify(EN_E01_IDLE_REGISTRY.families.map((family) => family.id)) === JSON.stringify(registryOrder), 'the approved Idle registry must use deterministic family-id order');
check(EN_E01_IDLE_REGISTRY.renderers.length === 1, 'EN-E01 must share one humanoid renderer');
check(EN_E01_IDLE_REGISTRY.renderers[0].key === 'humanoid-threat-v1', 'EN-E01 must use the versioned shared humanoid renderer');
check(EN_E01_IDLE_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'EN-E01 must declare the humanoid-v1 chassis');
check(EN_E01_IDLE_REGISTRY.publicFamilies.length === 0, 'Idle evidence must not enter the public family view');
check(EN_E01_IDLE_REGISTRY.approvedFamilies.length === 0, 'Idle approval must not claim completed-family approval');
check(Object.isFrozen(EN_E01_IDLE_REGISTRY), 'the approved EN-E01 Idle registry must be immutable');
check(engine.ENEMY_EXPANSION_REGISTRY.families.length === 10, 'the cumulative expansion registry must contain the ten approved EN-E01/EN-E02 families');
check(engine.ENEMY_EXPANSION_REGISTRY.publicFamilies.length === 10, 'the cumulative expansion view must contain ten approved EN-E01/EN-E02 families');
check(engine.ENEMIES.length === 57, 'the legacy Enemy catalog must remain at 57 families');
check(cardOrder.every((id) => !engine.ENEMIES.some((family) => family.id === id)), 'EN-E01 registration must not rewrite the legacy Enemy catalog');

for (const family of EN_E01_IDLE_REGISTRY.families) {
  check(family.state === engine.ENEMY_EXPANSION_STATES.IMPLEMENTED, 'Frozen Idle evidence family ' + family.id + ' must retain its implemented snapshot state');
  check(family.variants.length === 1, 'Candidate ' + family.id + ' must register only its baseline variant');
  check(family.variants[0].id === expectedBaselines[family.id], 'Candidate ' + family.id + ' registered the wrong baseline');
}

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(facadeSource.includes('enemy-expansion-public.js'), 'the public sprite-engine facade must route expansion API through the approved registry boundary');
check(!facadeSource.includes('enemy-expansion-en-e01'), 'the public sprite-engine facade must not import EN-E01 implementation details directly');
check(!facadeSource.includes('EN_E01_'), 'the public sprite-engine facade must not expose EN-E01 implementation symbols');

const reviewPlan = engine.buildEnemyExpansionReviewPlan(EN_E01_IDLE_REGISTRY, { sliceId: 'EN-E01' });
check(JSON.stringify(reviewPlan.families.map((family) => family.id)) === JSON.stringify(registryOrder), 'slice review targeting must select the five candidates deterministically');
check(reviewPlan.families.every((family) => family.state === engine.ENEMY_EXPANSION_STATES.IMPLEMENTED), 'review-plan families must remain implemented candidates');
check(reviewPlan.frames.length === 8, 'the EN-E01 gate must contain two Idle frames in four directions');
check(
  JSON.stringify(reviewPlan.frames) === JSON.stringify(engine.DIRS.flatMap((direction) => [
    { direction, animation: 'idle', frame: 0 },
    { direction, animation: 'idle', frame: 1 },
  ])),
  'the EN-E01 review frame order must be Down, Left, Right, Up with two Idle frames each',
);
check(JSON.stringify(reviewPlan) === JSON.stringify(engine.buildEnemyExpansionReviewPlan(EN_E01_IDLE_REGISTRY, { sliceId: 'EN-E01' })), 'the EN-E01 review plan must be deterministic');

const frameRecords = [];
for (const card of EN_E01_CONTRACT_CARDS) {
  const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
  const directionMasks = new Map();
  for (const direction of engine.DIRS) {
    const idleFrames = [];
    for (let frame = 0; frame < 2; frame++) {
      const rendered = captureEnemyExpansionFrame(EN_E01_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
      const repeated = captureEnemyExpansionFrame(EN_E01_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
      const prefix = card.id + '/' + direction + '/idle/' + frame;
      check(rendered.digest === repeated.digest, prefix + ' must render deterministically');
      check(rendered.opaquePixels > 0, prefix + ' must not be empty');
      check(rendered.outOfBoundsWrites.length === 0, prefix + ' attempted out-of-bounds drawing');
      check(rendered.colors.every((color) => /^#[0-9a-f]{6}$/i.test(color)), prefix + ' must use opaque six-digit colors only');
      check([...rendered.alpha].every((alpha) => alpha === 0 || alpha === 255), prefix + ' must use binary alpha');
      check(rendered.bounds && rendered.bounds.minX >= 1 && rendered.bounds.maxX <= 22 && rendered.bounds.minY >= 1 && rendered.bounds.maxY <= 22, prefix + ' must retain a one-cell canvas margin');
      check(rendered.renderResult?.family === card.id && rendered.renderResult?.variant === card.baseline.variantId, prefix + ' returned the wrong renderer evidence');
      idleFrames.push(rendered);
      frameRecords.push({ family: card.id, direction, frame, digest: rendered.digest, alphaDigest: rendered.alphaDigest, opaquePixels: rendered.opaquePixels, bounds: rendered.bounds });
    }
    check(idleFrames[0].digest !== idleFrames[1].digest, card.id + '/' + direction + ' needs visible two-frame Idle motion');
    directionMasks.set(direction, idleFrames[0].alphaDigest);
  }
  check(new Set(directionMasks.values()).size >= 3, card.id + ' needs readable front, side, and rear Idle silhouettes');
}

for (const card of EN_E01_CONTRACT_CARDS) for (let frame = 0; frame < 2; frame++) {
  const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
  const right = captureEnemyExpansionFrame(EN_E01_IDLE_REGISTRY, spec, 'right', 'idle', frame, engine.SIZE);
  const left = captureEnemyExpansionFrame(EN_E01_IDLE_REGISTRY, spec, 'left', 'idle', frame, engine.SIZE);
  const mirroredRightMask = alphaDigest(mirrorPixels(right.pixels, engine.SIZE));
  check(mirroredRightMask === left.alphaDigest, card.id + '/idle/' + frame + ' left silhouette must mirror the right silhouette while preserving equipment handedness');
  check(right.opaquePixels === left.opaquePixels, card.id + '/idle/' + frame + ' side views must retain equal occupied area');
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const silhouettes = EN_E01_CONTRACT_CARDS.map((card) => {
    const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
    return alphaDigest(captureEnemyExpansionFrame(EN_E01_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE).pixels);
  });
  check(new Set(silhouettes).size === EN_E01_CONTRACT_CARDS.length, direction + '/idle/' + frame + ' must keep all five baseline silhouettes distinct');
}

rejects(
  () => engine.renderEnemyExpansionFrame(
    EN_E01_IDLE_REGISTRY,
    { kind: 'enemy', family: 'witch', variant: 'familiar-keeper' },
    'down',
    'idle',
    0,
    { clearRect() {}, fillRect() {}, fillStyle: '#000000' },
  ),
  'is not implemented',
  'pre-approval specialist rendering',
);

const ledgerReport = engine.buildEnemyExpansionLedgerReport(engine.ENEMY_EXPANSION_LEDGER, EN_E01_IDLE_REGISTRY);
check(ledgerReport.counts.approved === 3 && ledgerReport.counts.implemented === 0, 'current ledger must report approved EN-F00/EN-E01/EN-E02');
check(ledgerReport.counts.registeredFamilies === 5 && ledgerReport.counts.publicFamilies === 0, 'candidate ledger evidence must report five internal and zero public families');
const enE01Slice = ledgerReport.slices.find((slice) => slice.id === 'EN-E01');
check(enE01Slice?.state === engine.ENEMY_EXPANSION_STATES.APPROVED && enE01Slice?.registeredFamilies === 5 && enE01Slice?.publicFamilies === 0, 'frozen Idle evidence must retain five internal baselines while the current ledger records EN-E01 approval');

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');

if (errors.length) {
  console.error('EN-E01 Idle candidate validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E01 Idle candidate validation passed.');
console.log('- Contract cards: 5');
console.log('- Internal baseline families: 5');
console.log('- Implemented variants: 5 common / 0 specialist / 0 elite');
console.log('- Reviewed frames: ' + frameRecords.length + ' (4 directions x 2 Idle frames x 5 families)');
console.log('- Public expansion families: 0');
console.log('- Approved EN-E01 registry families: 5');
console.log('- Candidate frame digest: ' + candidateDigest);
