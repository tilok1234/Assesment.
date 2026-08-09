import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E01_CANDIDATE_FAMILIES,
  EN_E01_CANDIDATE_REGISTRY,
  EN_E01_CONTRACT_CARDS,
  EN_E01_IDLE_GATE,
} from '../engine/enemy-expansion-en-e01.js';
import {
  captureEnemyExpansionFrame,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

const expectedFamilies = ['alchemist', 'fallen-knight', 'necromancer', 'pirate', 'witch'];
const expectedVariants = {
  witch: ['hexer', 'familiar-keeper', 'cauldron-brewer'],
  'fallen-knight': ['shieldbearer', 'banner-lancer', 'blackguard'],
  pirate: ['deckhand', 'gunner', 'bomb-bosun'],
  necromancer: ['bone-caller', 'grave-binder', 'ossuary-master'],
  alchemist: ['flask-thrower', 'smoke-brewer', 'mutagenist'],
};

check(EN_E01_IDLE_GATE.status === 'approved', 'full production must retain the approved Idle gate');
check(EN_E01_CANDIDATE_FAMILIES.length === 5, 'full EN-E01 needs five candidate families');
check(JSON.stringify(EN_E01_CANDIDATE_REGISTRY.families.map((family) => family.id)) === JSON.stringify(expectedFamilies), 'full EN-E01 family order must be deterministic');
check(EN_E01_CANDIDATE_REGISTRY.renderers.length === 1, 'all full EN-E01 variants must share one renderer');
check(EN_E01_CANDIDATE_REGISTRY.renderers[0].key === 'humanoid-threat-v1', 'full EN-E01 must retain the approved renderer key');
check(EN_E01_CANDIDATE_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'full EN-E01 must retain the approved chassis');
check(EN_E01_CANDIDATE_REGISTRY.publicFamilies.length === 0, 'full EN-E01 candidates must remain outside the public family view');
check(EN_E01_CANDIDATE_REGISTRY.approvedFamilies.length === 0, 'full EN-E01 candidates must not claim completed-family approval');
check(engine.ENEMY_EXPANSION_REGISTRY.families.length === 23, 'the approved backlog integration must extend the cumulative stable registry to twenty-three approved families');
check(engine.ENEMY_EXPANSION_REGISTRY.publicFamilies.length === 23, 'the approved backlog integration must extend the cumulative stable view to twenty-three approved families');
check(engine.ENEMIES.length === 57, 'the legacy Enemy catalog must remain at 57 families');
check(Object.isFrozen(EN_E01_CANDIDATE_REGISTRY), 'the full EN-E01 registry must be immutable');

for (const card of EN_E01_CONTRACT_CARDS) {
  const family = EN_E01_CANDIDATE_REGISTRY.families.find((entry) => entry.id === card.id);
  check(Boolean(family), 'missing full candidate family ' + card.id);
  if (!family) continue;
  check(family.state === engine.ENEMY_EXPANSION_STATES.IMPLEMENTED, card.id + ' frozen candidate evidence must retain its implemented snapshot state');
  check(card.additionalVariants?.length === 2, card.id + ' needs exactly specialist and elite renderer data');
  check(JSON.stringify(family.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[card.id]), card.id + ' must register common, specialist, elite in approved brief order');
  check(JSON.stringify(card.variantBriefs.map((variant) => variant.role)) === JSON.stringify(['common', 'specialist', 'elite']), card.id + ' roles must remain common, specialist, elite');
  check(family.variants.every((variant) => variant.rendererData?.actor && Array.isArray(variant.rendererData?.identity?.overlays)), card.id + ' variants need complete actor and identity renderer data');
  check(family.variants.every((variant) => !/\b(effect|projectile|summon|familiar|cauldron|explosion|smoke cloud)\b/i.test(JSON.stringify(variant.rendererData))), card.id + ' renderer data must not bake external effect or child-asset contracts');
}

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(facadeSource.includes('enemy-expansion-public.js'), 'the public facade must route through the approved expansion boundary');
check(!facadeSource.includes('enemy-expansion-en-e01'), 'the public facade must not import EN-E01 implementation details directly');
check(!facadeSource.includes('EN_E01_'), 'the public facade must not expose EN-E01 implementation symbols');

const frameByKey = new Map();
const frameRecords = [];
const sheetResults = [];
for (const card of EN_E01_CONTRACT_CARDS) {
  for (const variantBrief of card.variantBriefs) {
    const spec = { kind: 'enemy', family: card.id, variant: variantBrief.id };
    const sheetFrames = [];
    for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const rendered = captureEnemyExpansionFrame(EN_E01_CANDIDATE_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
        const repeated = captureEnemyExpansionFrame(EN_E01_CANDIDATE_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
        const prefix = card.id + '/' + variantBrief.id + '/' + direction + '/' + animation.id + '/' + frame;
        check(rendered.digest === repeated.digest, prefix + ' must render deterministically');
        check(rendered.opaquePixels > 0, prefix + ' must not be empty');
        check(rendered.outOfBoundsWrites.length === 0, prefix + ' attempted out-of-bounds drawing');
        check(rendered.colors.every((color) => /^#[0-9a-f]{6}$/i.test(color)), prefix + ' must use opaque six-digit colors only');
        check([...rendered.alpha].every((alpha) => alpha === 0 || alpha === 255), prefix + ' must use binary alpha');
        check(rendered.bounds && rendered.bounds.minX >= 1 && rendered.bounds.maxX <= 22 && rendered.bounds.minY >= 1 && rendered.bounds.maxY <= 22, prefix + ' must retain a one-cell canvas margin');
        check(rendered.renderResult?.animation === animation.id && rendered.renderResult?.frame === frame, prefix + ' returned the wrong requested-frame evidence');
        const key = [card.id, variantBrief.id, direction, animation.id, frame].join('/');
        frameByKey.set(key, rendered);
        frameRecords.push({
          family: card.id,
          variant: variantBrief.id,
          direction,
          animation: animation.id,
          frame,
          digest: rendered.digest,
          alphaDigest: rendered.alphaDigest,
          opaquePixels: rendered.opaquePixels,
          bounds: rendered.bounds,
        });
        sheetFrames.push({
          direction,
          animation: animation.id,
          frame,
          alpha: rendered.alpha,
          outOfBoundsWrites: rendered.outOfBoundsWrites,
        });
      }
    }
    const sheetResult = engine.validateEnemyExpansionSheet({
      width: engine.ENEMY_EXPANSION_PROFILE.frameContract.width,
      height: engine.ENEMY_EXPANSION_PROFILE.frameContract.height,
      directions: [...engine.DIRS],
      frames: sheetFrames,
    });
    check(sheetResult.valid && sheetResult.frames === 80 && sheetResult.binaryAlpha, card.id + '/' + variantBrief.id + ' must satisfy the complete 480x96 sheet contract');
    sheetResults.push({ family: card.id, variant: variantBrief.id, ...sheetResult });
  }
}

check(frameRecords.length === 1200, 'full EN-E01 must render 1,200 frames across 15 complete sheets');
check(sheetResults.length === 15, 'full EN-E01 must validate 15 complete 480x96 sheets');

for (const card of EN_E01_CONTRACT_CARDS) for (const variantBrief of card.variantBriefs) {
  for (const direction of engine.DIRS) {
    const prefix = [card.id, variantBrief.id, direction].join('/');
    const digests = (animationId) => engine.ANIMS.find((animation) => animation.id === animationId)
      ? Array.from({ length: engine.ANIMS.find((animation) => animation.id === animationId).frames }, (_, frame) => frameByKey.get(prefix + '/' + animationId + '/' + frame).digest)
      : [];
    const idle = digests('idle');
    const walk = digests('walk');
    const attack = digests('attack');
    const cast = digests('cast');
    const hurt = digests('hurt');
    const death = digests('death');
    check(new Set(idle).size === 2, prefix + ' needs two distinct Idle frames');
    check(new Set(walk).size >= 3, prefix + ' needs at least three distinct Walk poses');
    check(new Set(attack).size >= 3, prefix + ' needs at least three distinct Attack phases');
    check(new Set(hurt).size === 2, prefix + ' needs two distinct Hurt frames');
    check(JSON.stringify(cast) === JSON.stringify(attack), prefix + ' Cast must be pixel-identical to Attack');
    check(JSON.stringify(death) === JSON.stringify([hurt[0], hurt[1], hurt[1], hurt[1]]), prefix + ' Death must alias Hurt as frames 1,2,2,2');
    check(!idle.includes(attack[0]) && !idle.includes(attack[1]), prefix + ' Attack must not collapse to Idle');
  }
}

for (const card of EN_E01_CONTRACT_CARDS) for (const direction of engine.DIRS) {
  const idleSilhouettes = card.variantBriefs.map((variant) => frameByKey.get([card.id, variant.id, direction, 'idle', 0].join('/')).alphaDigest);
  const attackSilhouettes = card.variantBriefs.map((variant) => frameByKey.get([card.id, variant.id, direction, 'attack', 1].join('/')).alphaDigest);
  check(new Set(idleSilhouettes).size === 3, card.id + '/' + direction + ' must keep all three Idle silhouettes distinct');
  check(new Set(attackSilhouettes).size === 3, card.id + '/' + direction + ' must keep all three Attack silhouettes distinct');
}

for (const card of EN_E01_CONTRACT_CARDS) for (const variantBrief of card.variantBriefs) {
  const directionMasks = engine.DIRS.map((direction) => frameByKey.get([card.id, variantBrief.id, direction, 'idle', 0].join('/')).alphaDigest);
  check(new Set(directionMasks).size >= 3, card.id + '/' + variantBrief.id + ' needs readable front, side, and rear silhouettes');
}

const approvedIdleRecords = [];
for (const card of EN_E01_CONTRACT_CARDS) for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const rendered = frameByKey.get([card.id, card.baseline.variantId, direction, 'idle', frame].join('/'));
  approvedIdleRecords.push({ family: card.id, direction, frame, digest: rendered.digest, alphaDigest: rendered.alphaDigest, opaquePixels: rendered.opaquePixels, bounds: rendered.bounds });
}
const approvedIdleDigest = createHash('sha256').update(JSON.stringify(approvedIdleRecords)).digest('hex');
check(approvedIdleDigest === EN_E01_IDLE_GATE.candidateFrameDigest, 'full production changed the exact approved common-baseline Idle frames');

const ledgerReport = engine.buildEnemyExpansionLedgerReport(engine.ENEMY_EXPANSION_LEDGER, EN_E01_CANDIDATE_REGISTRY);
check(ledgerReport.counts.registeredFamilies === 5 && ledgerReport.counts.publicFamilies === 0, 'full EN-E01 ledger evidence must report five internal and zero public families');
const fullFrameDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');

if (errors.length) {
  console.error('EN-E01 full candidate validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E01 full candidate validation passed.');
console.log('- Contract cards: 5');
console.log('- Internal variants: 15 (5 common / 5 specialist / 5 elite)');
console.log('- Complete sheets: 15 (480x96)');
console.log('- Reviewed frames: 1,200');
console.log('- Public expansion families: 0');
console.log('- Approved EN-E01 registry families: 5');
console.log('- Approved Idle digest: ' + approvedIdleDigest);
console.log('- Full candidate frame digest: ' + fullFrameDigest);
