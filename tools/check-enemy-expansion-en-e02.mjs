import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E02_CONTRACT_CARDS,
  EN_E02_IDLE_FAMILIES,
  EN_E02_IDLE_GATE,
  EN_E02_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e02.js';
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

const cardOrder = ['plague-doctor', 'desert-raider', 'fanatic-monk', 'catfolk', 'goatfolk'];
const registryOrder = ['catfolk', 'desert-raider', 'fanatic-monk', 'goatfolk', 'plague-doctor'];
const expectedBaselines = {
  'plague-doctor': 'field-chirurgeon',
  'desert-raider': 'dune-reaver',
  'fanatic-monk': 'ash-disciple',
  catfolk: 'alley-prowler',
  goatfolk: 'crag-skirmisher',
};

check(JSON.stringify(EN_E02_CONTRACT_CARDS.map((card) => card.id)) === JSON.stringify(cardOrder), 'contract cards must retain the authorized EN-E02 review order');
check(Object.isFrozen(EN_E02_CONTRACT_CARDS) && EN_E02_CONTRACT_CARDS.every(Object.isFrozen), 'EN-E02 contract cards must be deeply immutable');
check(EN_E02_CONTRACT_CARDS.length === 5, 'EN-E02 needs exactly five contract cards');
check(EN_E02_IDLE_GATE.status === 'approved', 'the EN-E02 Idle gate must record visual approval');
check(EN_E02_IDLE_GATE.authorizedOn === '2026-08-02', 'the EN-E02 Idle gate must record its authorization date');
check(EN_E02_IDLE_GATE.approvedOn === '2026-08-02', 'the EN-E02 Idle gate must record its approval date');
check(EN_E02_IDLE_GATE.artifactSha256 === 'c224258139c7c810c7a122ea9e95061f3dd1697864913765fe9d11e09f4eca50', 'the EN-E02 Idle gate must freeze the approved artifact hash');
check(EN_E02_IDLE_GATE.candidateFrameDigest === '00d71d7e8f1904c275bfe84ec6cec746fb314fab4d27ce182d72e286a846d02b', 'the EN-E02 Idle gate must freeze the approved frame digest');
check(Object.isFrozen(EN_E02_IDLE_GATE), 'the EN-E02 Idle gate record must be immutable');

for (const card of EN_E02_CONTRACT_CARDS) {
  const prefix = 'Contract ' + card.id;
  check(card.sliceId === 'EN-E02', prefix + ' must belong to EN-E02');
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
  check(card.baseline?.rendererData?.identity?.overlays?.length > 0, prefix + ' needs an explicit family-identity overlay');
}

check(EN_E02_IDLE_FAMILIES.length === 5, 'the EN-E02 Idle definitions must contain five internal families');
check(JSON.stringify(EN_E02_IDLE_REGISTRY.families.map((family) => family.id)) === JSON.stringify(registryOrder), 'the EN-E02 Idle registry must use deterministic family-id order');
check(EN_E02_IDLE_REGISTRY.renderers.length === 1, 'EN-E02 must reuse one humanoid renderer');
check(EN_E02_IDLE_REGISTRY.renderers[0].key === 'humanoid-threat-v1', 'EN-E02 must reuse the versioned humanoid renderer');
check(EN_E02_IDLE_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'EN-E02 must declare the humanoid-v1 chassis');
check(EN_E02_IDLE_REGISTRY.publicFamilies.length === 0, 'EN-E02 Idle evidence must not enter the public family view');
check(EN_E02_IDLE_REGISTRY.approvedFamilies.length === 0, 'EN-E02 Idle evidence must not claim family approval');
check(Object.isFrozen(EN_E02_IDLE_REGISTRY), 'the EN-E02 Idle registry must be immutable');
check(engine.ENEMY_EXPANSION_REGISTRY.publicFamilies.length === 17, 'the later EN-E05 registration must extend the cumulative stable registry to seventeen approved families');
check(engine.PUBLIC_ENEMIES.length === 70, 'the consumer catalog must contain 70 families after authorized EN-E04 integration');
check(engine.ENEMIES.length === 57, 'the legacy Enemy catalog must remain at 57 families');
check(cardOrder.every((id) => engine.PUBLIC_ENEMIES.some((family) => family.id === id)), 'approved EN-E02 families must enter public consumers only after the separate integration gate');

for (const family of EN_E02_IDLE_REGISTRY.families) {
  check(family.state === engine.ENEMY_EXPANSION_STATES.IMPLEMENTED, 'Candidate ' + family.id + ' must remain implemented, not approved');
  check(family.variants.length === 1, 'Candidate ' + family.id + ' must register only its common baseline');
  check(family.variants[0].id === expectedBaselines[family.id], 'Candidate ' + family.id + ' registered the wrong baseline');
}

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e02'), 'the public facade must not import EN-E02 implementation details');
check(!facadeSource.includes('EN_E02_'), 'the public facade must not expose EN-E02 implementation symbols');

const reviewPlan = engine.buildEnemyExpansionReviewPlan(EN_E02_IDLE_REGISTRY, { sliceId: 'EN-E02' });
check(JSON.stringify(reviewPlan.families.map((family) => family.id)) === JSON.stringify(registryOrder), 'slice review targeting must select the five EN-E02 candidates deterministically');
check(reviewPlan.families.every((family) => family.state === engine.ENEMY_EXPANSION_STATES.IMPLEMENTED), 'review-plan families must remain implemented candidates');
check(reviewPlan.frames.length === 8, 'the EN-E02 gate must contain two Idle frames in four directions');
check(
  JSON.stringify(reviewPlan.frames) === JSON.stringify(engine.DIRS.flatMap((direction) => [
    { direction, animation: 'idle', frame: 0 },
    { direction, animation: 'idle', frame: 1 },
  ])),
  'the EN-E02 review frame order must be Down, Left, Right, Up with two Idle frames each',
);
check(JSON.stringify(reviewPlan) === JSON.stringify(engine.buildEnemyExpansionReviewPlan(EN_E02_IDLE_REGISTRY, { sliceId: 'EN-E02' })), 'the EN-E02 review plan must be deterministic');

const frameRecords = [];
for (const card of EN_E02_CONTRACT_CARDS) {
  const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
  const directionMasks = new Map();
  for (const direction of engine.DIRS) {
    const idleFrames = [];
    for (let frame = 0; frame < 2; frame++) {
      const rendered = captureEnemyExpansionFrame(EN_E02_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
      const repeated = captureEnemyExpansionFrame(EN_E02_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
      const prefix = card.id + '/' + direction + '/idle/' + frame;
      check(rendered.digest === repeated.digest, prefix + ' must render deterministically');
      check(rendered.opaquePixels > 0, prefix + ' must not be empty');
      check(rendered.outOfBoundsWrites.length === 0, prefix + ' attempted out-of-bounds drawing');
      check(rendered.colors.every((color) => /^#[0-9a-f]{6}$/i.test(color)), prefix + ' must use opaque six-digit colors only');
      check([...rendered.alpha].every((alpha) => alpha === 0 || alpha === 255), prefix + ' must use binary alpha');
      check(rendered.bounds && rendered.bounds.minX >= 1 && rendered.bounds.maxX <= 22 && rendered.bounds.minY >= 1 && rendered.bounds.maxY <= 22, prefix + ' must retain a one-cell canvas margin');
      check(rendered.renderResult?.family === card.id && rendered.renderResult?.variant === card.baseline.variantId, prefix + ' returned the wrong renderer evidence');
      idleFrames.push(rendered);
      frameRecords.push({
        family: card.id,
        direction,
        frame,
        digest: rendered.digest,
        alphaDigest: rendered.alphaDigest,
        opaquePixels: rendered.opaquePixels,
        bounds: rendered.bounds,
      });
    }
    check(idleFrames[0].digest !== idleFrames[1].digest, card.id + '/' + direction + ' needs visible two-frame Idle motion');
    directionMasks.set(direction, idleFrames[0].alphaDigest);
  }
  check(new Set(directionMasks.values()).size >= 3, card.id + ' needs readable front, side, and rear Idle silhouettes');
}

for (const card of EN_E02_CONTRACT_CARDS) for (let frame = 0; frame < 2; frame++) {
  const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
  const right = captureEnemyExpansionFrame(EN_E02_IDLE_REGISTRY, spec, 'right', 'idle', frame, engine.SIZE);
  const left = captureEnemyExpansionFrame(EN_E02_IDLE_REGISTRY, spec, 'left', 'idle', frame, engine.SIZE);
  const mirroredRightMask = alphaDigest(mirrorPixels(right.pixels, engine.SIZE));
  check(mirroredRightMask === left.alphaDigest, card.id + '/idle/' + frame + ' left silhouette must mirror the right silhouette');
  check(right.opaquePixels === left.opaquePixels, card.id + '/idle/' + frame + ' side views must retain equal occupied area');
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const silhouettes = EN_E02_CONTRACT_CARDS.map((card) => {
    const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
    return alphaDigest(captureEnemyExpansionFrame(EN_E02_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE).pixels);
  });
  check(new Set(silhouettes).size === EN_E02_CONTRACT_CARDS.length, direction + '/idle/' + frame + ' must keep all five baseline silhouettes distinct');
}

rejects(
  () => engine.renderEnemyExpansionFrame(
    EN_E02_IDLE_REGISTRY,
    { kind: 'enemy', family: 'plague-doctor', variant: 'leech-warden' },
    'down',
    'idle',
    0,
    { clearRect() {}, fillRect() {}, fillStyle: '#000000' },
  ),
  'is not implemented',
  'Idle-snapshot specialist rendering',
);

const ledgerReport = engine.buildEnemyExpansionLedgerReport(engine.ENEMY_EXPANSION_LEDGER, EN_E02_IDLE_REGISTRY);
check(ledgerReport.counts.approved === 5 && ledgerReport.counts.implemented === 0 && ledgerReport.counts.planned === 17, 'current ledger must report five approved, zero implemented, and seventeen planned slices');
check(ledgerReport.counts.registeredFamilies === 5 && ledgerReport.counts.publicFamilies === 0, 'candidate ledger evidence must report five internal and zero public families');
const enE02Slice = ledgerReport.slices.find((slice) => slice.id === 'EN-E02');
check(enE02Slice?.state === engine.ENEMY_EXPANSION_STATES.APPROVED && enE02Slice?.registeredFamilies === 5 && enE02Slice?.publicFamilies === 0, 'the frozen EN-E02 Idle evidence must retain five internal baselines while the ledger records completed-slice approval');

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(candidateDigest === EN_E02_IDLE_GATE.candidateFrameDigest, 'approved EN-E02 Idle frame digest drifted');

if (errors.length) {
  console.error('EN-E02 Idle candidate validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E02 approved Idle baseline validation passed.');
console.log('- Contract cards: 5');
console.log('- Internal baseline families: 5');
console.log('- Implemented variants: 5 common / 0 specialist / 0 elite');
console.log('- Reviewed frames: ' + frameRecords.length + ' (4 directions x 2 Idle frames x 5 families)');
console.log('- Frozen Idle evidence view: 0 approved/public EN-E02 families');
console.log('- Candidate frame digest: ' + candidateDigest);
