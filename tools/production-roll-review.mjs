import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as engine from '../sprite-engine.js';
import {
  capturePixels,
  renderLayerPixels,
  renderSpritePixels,
} from '../engine/pixel-buffer.js';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
if (outputFlag >= 0 && !process.argv[outputFlag + 1]) {
  throw new Error('--out requires a directory');
}
const output = path.resolve(
  root,
  outputFlag >= 0 ? process.argv[outputFlag + 1] : 'production-roll-review',
);
await mkdir(output, { recursive: true });

const PAIRS_PER_CLASS = 12;
const EXPECTED_PAIR_COUNT = engine.CLASS_TEMPLATES.length * PAIRS_PER_CLASS;
const MAX_SEED_CANDIDATES_PER_CLASS = 5000;
const UINT32_RANGE = 0x100000000;
const TWO_HANDED_WEAPONS = new Set([
  'greatsword',
  'warhammer',
  'spear',
  'club',
  'bow',
  'crossbow',
  'staff',
  'spellbook',
]);
const TREATMENTS = Object.freeze([
  Object.freeze({
    id: 'none',
    name: 'None',
    outlineMode: engine.OUTLINE_MODE_NONE,
  }),
  Object.freeze({
    id: 'complete-b',
    name: 'Complete B',
    outlineMode: engine.OUTLINE_MODE_COMPLETE_B,
  }),
  Object.freeze({
    id: 'selective-c',
    name: 'Selective C',
    outlineMode: engine.OUTLINE_MODE_SELECTIVE_C,
  }),
]);
const CATALOG_FIELDS = Object.freeze([
  Object.freeze(['species', engine.SPECIES]),
  Object.freeze(['bodyBuild', engine.BODY_BUILDS]),
  Object.freeze(['skin', engine.SKINS]),
  Object.freeze(['hairStyle', engine.HAIR_STYLES]),
  Object.freeze(['hairColor', engine.HAIR_COLORS]),
  Object.freeze(['expression', engine.EXPRESSIONS]),
  Object.freeze(['faceDetail', engine.FACIAL_DETAILS]),
  Object.freeze(['headgear', engine.HEADGEAR]),
  Object.freeze(['outfit', engine.OUTFITS]),
  Object.freeze(['outfitTier', engine.OUTFIT_TIERS]),
  Object.freeze(['outfitColor', engine.OUTFIT_COLORS]),
  Object.freeze(['weapon', engine.WEAPONS]),
  Object.freeze(['weaponTier', engine.WEAPON_TIERS]),
  Object.freeze(['shield', engine.SHIELDS]),
  Object.freeze(['shieldTier', engine.SHIELD_TIERS]),
  Object.freeze(['offhand', engine.OFFHANDS]),
]);

function arraysEqual(left, right) {
  return left.length === right.length
    && left.every((value, index) => value === right[index]);
}

function hashSeed(seed) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / UINT32_RANGE;
  };
}

function deterministicWildcardPlayer(seed) {
  const originalRandom = Math.random;
  Math.random = seededRandom(`${seed}:wildcard-control`);
  try {
    return engine.randomPlayer();
  } finally {
    Math.random = originalRandom;
  }
}

function catalogIdsValid(player) {
  return CATALOG_FIELDS.every(([field, catalog]) => (
    catalog.some((item) => item.id === player[field])
  ));
}

function headgearDefinition(id) {
  return engine.HEADGEAR.find((item) => item.id === id) || engine.HEADGEAR[0];
}

function headgearCoverage(player) {
  const definition = headgearDefinition(player.headgear);
  if (definition.hideAll === true) return 'full';
  if (definition.hideFace === true) return 'face';
  if (definition.hideTop === true) return 'top';
  return 'open';
}

function faceClearance(player) {
  const coverage = headgearCoverage(player);
  const normalizationRequired = coverage === 'full' || coverage === 'face';
  return {
    coverage,
    normalizationRequired,
    pass: !normalizationRequired
      || (player.expression === 'neutral' && player.faceDetail === 'none'),
  };
}

function equipmentType(player) {
  if (player.offhand && player.offhand !== 'none') return 'utility-offhand';
  if (player.shield && player.shield !== 'none') return 'shield';
  if (!player.weapon || player.weapon === 'none') return 'unarmed';
  if (TWO_HANDED_WEAPONS.has(player.weapon)) return 'two-handed';
  return 'one-handed';
}

function boundedDecision(result) {
  return result.decisions.find((decision) => decision.rule === 'bounded-selection');
}

function reviewCase({
  id,
  rollType,
  seed,
  pairedClass,
  player,
  productionResult,
}) {
  const context = {
    archetype: pairedClass,
    powerTier: productionResult.powerTier,
    paletteFamily: productionResult.paletteFamily,
  };
  const validation = engine.validateProductionPlayer(player, context);
  const bounded = boundedDecision(productionResult);
  const ruleReasons = rollType === 'production'
    ? [
      ...(productionResult.fallback ? ['fallback'] : []),
      ...(bounded?.retryReasons || []),
    ]
    : [...validation.reasons];
  return {
    id,
    rollType,
    seed,
    pairedClass,
    profile: rollType === 'production' ? productionResult.profile : 'wildcard',
    powerTier: rollType === 'production' ? productionResult.powerTier : player.outfitTier,
    paletteFamily: rollType === 'production' ? productionResult.paletteFamily : null,
    attempts: rollType === 'production' ? productionResult.attempts : null,
    fallback: rollType === 'production' ? productionResult.fallback : false,
    headgearCoverage: headgearCoverage(player),
    equipmentType: equipmentType(player),
    complexityUsage: validation.complexity.used,
    policyCompatible: validation.valid,
    policyReasons: [...validation.reasons],
    ruleReasons: ruleReasons.length ? [...new Set(ruleReasons)].sort() : ['none'],
    player: {
      kind: 'player',
      ...player,
      palette: null,
    },
  };
}

function renderAssembled(spec, direction, animationId, frame, treatment, onOutOfBounds) {
  return capturePixels((context) => {
    engine.drawAssembledSprite(context, spec, direction, animationId, frame, {
      clear: true,
      shadow: false,
      shadeMode: engine.SHADE_MODE_FORM,
      outlineMode: treatment.outlineMode,
      onOutOfBounds,
    });
  });
}

function mergeLayers(layers) {
  const merged = new Array(engine.SIZE * engine.SIZE).fill(null);
  for (const pixels of layers) {
    for (let index = 0; index < merged.length; index++) {
      if (pixels[index] !== null && pixels[index] !== undefined) {
        merged[index] = pixels[index];
      }
    }
  }
  return merged;
}

function minimumPixelDistance(first, second, limit = 3) {
  for (let distance = 0; distance <= limit; distance++) {
    for (let index = 0; index < first.length; index++) {
      if (!first[index]) continue;
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      for (let offsetY = -distance; offsetY <= distance; offsetY++) {
        for (let offsetX = -distance; offsetX <= distance; offsetX++) {
          if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) !== distance) continue;
          const nextX = x + offsetX;
          const nextY = y + offsetY;
          if (
            nextX >= 0
            && nextY >= 0
            && nextX < engine.SIZE
            && nextY < engine.SIZE
            && second[(nextY * engine.SIZE) + nextX]
          ) return distance;
        }
      }
    }
  }
  return null;
}

function countMatchingVisiblePixels(ownerPixels, assembledPixels) {
  return ownerPixels.reduce((
    count,
    color,
    index,
  ) => count + (color && assembledPixels[index] === color ? 1 : 0), 0);
}

function equipmentAttachments(spec, direction, animationId, frame) {
  const complete = renderSpritePixels(spec, direction, animationId, frame, {
    shadow: false,
  });
  const body = renderLayerPixels(spec, direction, animationId, frame, 'body');
  const axes = [];
  if (spec.weapon && spec.weapon !== 'none') {
    axes.push({
      axis: 'weapon',
      id: spec.weapon,
      layers: ['weapon-back', 'weapon-front'],
    });
  }
  if (spec.shield && spec.shield !== 'none') {
    axes.push({
      axis: 'shield',
      id: spec.shield,
      layers: ['shield-back', 'shield-front'],
    });
  }
  if (spec.offhand && spec.offhand !== 'none') {
    axes.push({
      axis: 'offhand',
      id: spec.offhand,
      layers: ['offhand-back', 'offhand-front'],
    });
  }
  return axes.map((axis) => {
    const owner = mergeLayers(axis.layers.map((layer) => (
      renderLayerPixels(spec, direction, animationId, frame, layer)
    )));
    const totalPixels = owner.reduce((count, color) => count + (color ? 1 : 0), 0);
    const visiblePixels = countMatchingVisiblePixels(owner, complete);
    const bodyDistance = minimumPixelDistance(owner, body);
    return {
      axis: axis.axis,
      id: axis.id,
      totalPixels,
      visiblePixels,
      bodyDistance,
      pass: totalPixels > 0
        && bodyDistance !== null
        && bodyDistance <= 3,
    };
  });
}

function edgePixelCount(pixels) {
  let count = 0;
  for (let y = 0; y < engine.SIZE; y++) {
    for (let x = 0; x < engine.SIZE; x++) {
      if (
        (x === 0 || y === 0 || x === engine.SIZE - 1 || y === engine.SIZE - 1)
        && pixels[(y * engine.SIZE) + x]
      ) count++;
    }
  }
  return count;
}

function pixelDigest(pixels) {
  let hash = 0x811c9dc5;
  for (const color of pixels) {
    const value = color || '-';
    for (let index = 0; index < value.length; index++) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function countBy(values) {
  const counts = {};
  for (const value of values) counts[value] = (counts[value] || 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => (
    left.localeCompare(right)
  )));
}

const report = {
  format: '8-bit-sprite-assembler-production-roll-review',
  version: 1,
  generatedAt: new Date().toISOString(),
  policy: {
    ...engine.PRODUCTION_ROLL_PROFILE,
    freezeStatus: engine.PRODUCTION_ROLL_FREEZE.status,
    acceptedCorpus: engine.PRODUCTION_ROLL_FREEZE.acceptedCorpus,
    acceptedPresentation: engine.PRODUCTION_ROLL_FREEZE.presentation,
    effects: 'off',
    shadeMode: engine.SHADE_MODE_FORM,
    outlineModes: TREATMENTS.map((treatment) => treatment.id),
    backgrounds: ['#e8ddc4', '#191b22'],
    transparentCanvas: true,
  },
  scope: {
    pairsPerClass: PAIRS_PER_CLASS,
    expectedPairs: EXPECTED_PAIR_COUNT,
    seedSearchBoundPerClass: MAX_SEED_CANDIDATES_PER_CLASS,
    directions: [...engine.DIRS],
    animations: engine.ANIMS.map((animation) => ({
      id: animation.id,
      frames: animation.frames,
    })),
    treatments: TREATMENTS.map((treatment) => treatment.id),
  },
  seedSearch: [],
  corpusDigest: null,
  coverage: {},
  totals: {
    pairs: 0,
    productionCases: 0,
    wildcardCases: 0,
    frameCases: 0,
    treatmentCases: 0,
    deterministicCases: 0,
    transparentCases: 0,
    boundsCases: 0,
    discardedWrites: 0,
    malformedPixels: 0,
    faceClearanceChecks: 0,
    productionFaceClearanceFailures: 0,
    wildcardFaceClearanceObservations: 0,
    attachmentChecks: 0,
    attachmentPasses: 0,
    attachmentVisibleFrames: 0,
    attachmentVisibilityGaps: 0,
  },
  corpus: [],
  attachmentSequences: [],
  frames: [],
  failures: [],
};

function fail(message) {
  report.failures.push(message);
}

const pairs = [];
for (const template of engine.CLASS_TEMPLATES) {
  let inspected = 0;
  let matched = 0;
  for (
    let candidate = 0;
    candidate < MAX_SEED_CANDIDATES_PER_CLASS && matched < PAIRS_PER_CLASS;
    candidate++
  ) {
    inspected++;
    const seed = `production-review:${template.id}:${String(candidate).padStart(4, '0')}`;
    const production = engine.rollProductionPlayer(seed);
    if (production.archetype !== template.id) continue;
    const wildcardPlayer = deterministicWildcardPlayer(seed);
    const pairId = `${template.id}-${String(matched + 1).padStart(2, '0')}`;
    pairs.push({
      id: pairId,
      seed,
      pairedClass: template.id,
      production: reviewCase({
        id: `${pairId}-production`,
        rollType: 'production',
        seed,
        pairedClass: template.id,
        player: production.player,
        productionResult: production,
      }),
      wildcard: reviewCase({
        id: `${pairId}-wildcard`,
        rollType: 'wildcard',
        seed,
        pairedClass: template.id,
        player: wildcardPlayer,
        productionResult: production,
      }),
    });
    matched++;
  }
  report.seedSearch.push({
    class: template.id,
    inspected,
    matched,
    limit: MAX_SEED_CANDIDATES_PER_CLASS,
  });
  if (matched !== PAIRS_PER_CLASS) {
    fail(`${template.id}: found ${matched}/${PAIRS_PER_CLASS} balanced seeds`);
  }
}

report.totals.pairs = pairs.length;
report.totals.productionCases = pairs.length;
report.totals.wildcardCases = pairs.length;
if (pairs.length !== EXPECTED_PAIR_COUNT) {
  fail(`corpus has ${pairs.length}/${EXPECTED_PAIR_COUNT} required pairs`);
}

for (const pair of pairs) {
  const productionReplay = engine.rollProductionPlayer(pair.seed);
  if (JSON.stringify(productionReplay.player) !== JSON.stringify(pair.production.player, (key, value) => (
    key === 'kind' || key === 'palette' ? undefined : value
  ))) {
    fail(`${pair.id}: Production replay changed`);
  }
  const wildcardReplay = deterministicWildcardPlayer(pair.seed);
  const wildcardReviewPlayer = { ...pair.wildcard.player };
  delete wildcardReviewPlayer.kind;
  delete wildcardReviewPlayer.palette;
  if (JSON.stringify(wildcardReplay) !== JSON.stringify(wildcardReviewPlayer)) {
    fail(`${pair.id}: Wildcard control replay changed`);
  }
  if (!catalogIdsValid(pair.production.player)) {
    fail(`${pair.id}: Production contains an invalid catalog id`);
  }
  if (!catalogIdsValid(pair.wildcard.player)) {
    fail(`${pair.id}: Wildcard contains an invalid catalog id`);
  }
  if (!pair.production.policyCompatible) {
    fail(`${pair.id}: Production violates ${pair.production.policyReasons.join(', ')}`);
  }
}

report.corpusDigest = createHash('sha256')
  .update(JSON.stringify(pairs))
  .digest('hex');
if (report.corpusDigest !== engine.PRODUCTION_ROLL_FREEZE.acceptedCorpus.digest) {
  fail(
    `frozen corpus digest changed: ${report.corpusDigest} `
    + `(accepted ${engine.PRODUCTION_ROLL_FREEZE.acceptedCorpus.digest})`,
  );
}
if (
  pairs.length !== engine.PRODUCTION_ROLL_FREEZE.acceptedCorpus.pairs
  || PAIRS_PER_CLASS !== engine.PRODUCTION_ROLL_FREEZE.acceptedCorpus.pairsPerClass
) {
  fail('frozen corpus balance changed');
}
report.coverage = {
  pairedClasses: countBy(pairs.map((pair) => pair.pairedClass)),
  productionSpecies: countBy(pairs.map((pair) => pair.production.player.species)),
  wildcardSpecies: countBy(pairs.map((pair) => pair.wildcard.player.species)),
  productionPowerTiers: countBy(pairs.map((pair) => pair.production.powerTier)),
  wildcardPowerTiers: countBy(pairs.map((pair) => pair.wildcard.powerTier)),
  productionHeadgearCoverage: countBy(pairs.map((pair) => pair.production.headgearCoverage)),
  wildcardHeadgearCoverage: countBy(pairs.map((pair) => pair.wildcard.headgearCoverage)),
  productionEquipmentTypes: countBy(pairs.map((pair) => pair.production.equipmentType)),
  wildcardEquipmentTypes: countBy(pairs.map((pair) => pair.wildcard.equipmentType)),
  productionComplexityUsage: countBy(pairs.map((pair) => pair.production.complexityUsage)),
  wildcardComplexityUsage: countBy(pairs.map((pair) => pair.wildcard.complexityUsage)),
  productionRuleReasons: countBy(pairs.flatMap((pair) => pair.production.ruleReasons)),
  wildcardPolicyReasons: countBy(pairs.flatMap((pair) => pair.wildcard.ruleReasons)),
};

const attachmentSequences = new Map();
for (const pair of pairs) {
  for (const review of [pair.production, pair.wildcard]) {
    const clearance = faceClearance(review.player);
    for (const direction of engine.DIRS) {
      for (const animation of engine.ANIMS) {
        for (let frame = 0; frame < animation.frames; frame++) {
          const prefix = `${review.id} ${direction} ${animation.id}/${frame + 1}`;
          const attachments = equipmentAttachments(
            review.player,
            direction,
            animation.id,
            frame,
          );
          report.totals.frameCases++;
          report.totals.faceClearanceChecks++;
          if (!clearance.pass) {
            if (review.rollType === 'production') {
              report.totals.productionFaceClearanceFailures++;
              fail(`${prefix}: Production retained hidden face choices`);
            } else {
              report.totals.wildcardFaceClearanceObservations++;
            }
          }
          for (const attachment of attachments) {
            report.totals.attachmentChecks++;
            if (attachment.visiblePixels > 0) report.totals.attachmentVisibleFrames++;
            else report.totals.attachmentVisibilityGaps++;
            if (attachment.pass) {
              report.totals.attachmentPasses++;
            } else {
              fail(
                `${prefix}: ${attachment.axis} ${attachment.id} lost its body registration `
                + `(visible ${attachment.visiblePixels}, distance ${attachment.bodyDistance})`,
              );
            }
            const sequenceKey = [
              review.id,
              direction,
              attachment.axis,
              attachment.id,
            ].join(':');
            const sequence = attachmentSequences.get(sequenceKey) || {
              caseId: review.id,
              rollType: review.rollType,
              direction,
              axis: attachment.axis,
              id: attachment.id,
              frameChecks: 0,
              registeredFrames: 0,
              visibleFrames: 0,
              minimumVisiblePixels: Number.POSITIVE_INFINITY,
              maximumVisiblePixels: 0,
            };
            sequence.frameChecks++;
            if (attachment.pass) sequence.registeredFrames++;
            if (attachment.visiblePixels > 0) sequence.visibleFrames++;
            sequence.minimumVisiblePixels = Math.min(
              sequence.minimumVisiblePixels,
              attachment.visiblePixels,
            );
            sequence.maximumVisiblePixels = Math.max(
              sequence.maximumVisiblePixels,
              attachment.visiblePixels,
            );
            attachmentSequences.set(sequenceKey, sequence);
          }

          const treatments = {};
          for (const treatment of TREATMENTS) {
            const discardedWrites = [];
            const first = renderAssembled(
              review.player,
              direction,
              animation.id,
              frame,
              treatment,
              (draw) => discardedWrites.push(draw),
            );
            const repeat = renderAssembled(
              review.player,
              direction,
              animation.id,
              frame,
              treatment,
            );
            const deterministic = arraysEqual(first, repeat);
            const transparentPixels = first.reduce((
              count,
              color,
            ) => count + (color ? 0 : 1), 0);
            const malformedPixels = first.reduce((
              count,
              color,
            ) => count + (color !== null && !/^#[0-9a-f]{6}$/i.test(color) ? 1 : 0), 0);
            report.totals.treatmentCases++;
            report.totals.boundsCases++;
            report.totals.discardedWrites += discardedWrites.length;
            report.totals.malformedPixels += malformedPixels;
            if (deterministic) report.totals.deterministicCases++;
            else fail(`${prefix} ${treatment.id}: nondeterministic Form/outline output`);
            if (transparentPixels > 0) report.totals.transparentCases++;
            else fail(`${prefix} ${treatment.id}: no transparent export pixels`);
            if (discardedWrites.length) {
              fail(`${prefix} ${treatment.id}: ${discardedWrites.length} discarded write(s)`);
            }
            if (malformedPixels) {
              fail(`${prefix} ${treatment.id}: ${malformedPixels} malformed pixel(s)`);
            }
            treatments[treatment.id] = {
              deterministic,
              digest: pixelDigest(first),
              transparentPixels,
              edgePixels: edgePixelCount(first),
              discardedWrites: discardedWrites.length,
              malformedPixels,
            };
          }

          report.frames.push({
            caseId: review.id,
            rollType: review.rollType,
            seed: review.seed,
            pairedClass: review.pairedClass,
            direction,
            animation: animation.id,
            frame,
            faceClearance: clearance,
            attachments,
            policyCompatible: review.policyCompatible,
            policyReasons: review.policyReasons,
            treatments,
          });
        }
      }
    }
  }
}

const framesPerCase = engine.DIRS.length
  * engine.ANIMS.reduce((sum, animation) => sum + animation.frames, 0);
const expectedFrameCases = pairs.length * 2 * framesPerCase;
const expectedTreatmentCases = expectedFrameCases * TREATMENTS.length;
if (report.totals.frameCases !== expectedFrameCases) {
  fail(`audited ${report.totals.frameCases}/${expectedFrameCases} required frame cases`);
}
if (report.totals.treatmentCases !== expectedTreatmentCases) {
  fail(`audited ${report.totals.treatmentCases}/${expectedTreatmentCases} required treatments`);
}
if (report.totals.deterministicCases !== report.totals.treatmentCases) {
  fail('not every Form/outline treatment reproduced deterministically');
}
if (report.totals.transparentCases !== report.totals.treatmentCases) {
  fail('not every reviewed treatment preserved transparency');
}
if (report.totals.attachmentPasses !== report.totals.attachmentChecks) {
  fail('not every equipped axis retained body registration');
}
report.attachmentSequences = [...attachmentSequences.values()];
for (const sequence of report.attachmentSequences) {
  if (!Number.isFinite(sequence.minimumVisiblePixels)) sequence.minimumVisiblePixels = 0;
  if (sequence.registeredFrames !== sequence.frameChecks) {
    fail(
      `${sequence.caseId} ${sequence.direction}: ${sequence.axis} ${sequence.id} `
      + `registered in ${sequence.registeredFrames}/${sequence.frameChecks} frames`,
    );
  }
  if (sequence.visibleFrames === 0) {
    fail(
      `${sequence.caseId} ${sequence.direction}: ${sequence.axis} ${sequence.id} `
      + 'was never visible in any reviewed animation frame',
    );
  }
}
for (const template of engine.CLASS_TEMPLATES) {
  if (report.coverage.pairedClasses[template.id] !== PAIRS_PER_CLASS) {
    fail(`${template.id}: class balance is not ${PAIRS_PER_CLASS}`);
  }
}

report.corpus = pairs;

const pairsJson = JSON.stringify(pairs).replaceAll('<', '\\u003c');
const reportSummaryJson = JSON.stringify({
  policy: report.policy,
  totals: report.totals,
  coverage: report.coverage,
  failures: report.failures,
}).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Production versus Wildcard Review</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #101217; color: #f3f4f6; }
    * { box-sizing: border-box; }
    body { margin: 0; min-width: 1180px; background: #101217; }
    header { position: sticky; top: 0; z-index: 5; padding: 14px 18px; background: rgba(16,18,23,.97); border-bottom: 1px solid #303541; }
    h1 { margin: 0 0 4px; font-size: 20px; }
    .subtitle { color: #abb4c4; font-size: 12px; }
    .filters { display: grid; grid-template-columns: repeat(6, minmax(130px, 1fr)); gap: 8px; margin-top: 12px; }
    .playback { display: grid; grid-template-columns: 2fr repeat(4, minmax(120px, 1fr)) 120px 120px; gap: 8px; margin-top: 8px; }
    label { display: grid; gap: 4px; color: #9fa9ba; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
    select, input, button { min-height: 32px; border: 1px solid #3a4250; border-radius: 6px; background: #1a1e26; color: #f3f4f6; padding: 5px 8px; }
    button { cursor: pointer; font-weight: 700; align-self: end; }
    button.active { background: #5b65d9; border-color: #7780ee; }
    main { padding: 16px 18px 30px; }
    .notice { display: flex; justify-content: space-between; gap: 16px; padding: 10px 12px; margin-bottom: 12px; border: 1px solid #303541; border-radius: 8px; background: #181c23; color: #cbd2df; font-size: 12px; }
    #review-stage { display: grid; gap: 14px; padding: 14px; border-radius: 10px; background: #e8ddc4; }
    #review-stage.dark { background: #191b22; }
    .roll-section { padding: 12px; border: 1px solid rgba(42,47,57,.28); border-radius: 9px; background: rgba(16,18,23,.9); }
    .roll-section[hidden] { display: none; }
    .roll-heading { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; margin-bottom: 10px; }
    .roll-heading h2 { margin: 0; font-size: 15px; }
    .roll-heading span { color: #aeb6c5; font-size: 11px; }
    .treatments { display: grid; grid-template-columns: repeat(3, minmax(260px, 1fr)); gap: 10px; }
    .card { padding: 10px; border: 1px solid rgba(127,138,160,.42); border-radius: 7px; background: rgba(24,28,35,.92); }
    .card h3 { margin: 0 0 4px; font-size: 12px; }
    .card p { min-height: 28px; margin: 0 0 8px; color: #9fa9ba; font-size: 10px; line-height: 1.35; }
    .canvas-row { display: grid; grid-template-columns: 1fr 52px; gap: 10px; align-items: end; }
    .zoom-wrap { display: grid; place-items: center; min-height: 216px; border-radius: 5px; }
    canvas { image-rendering: pixelated; image-rendering: crisp-edges; }
    canvas.zoom { width: 216px; height: 216px; }
    canvas.native { width: 24px; height: 24px; outline: 1px solid rgba(255,255,255,.18); }
    .native-label { display: grid; gap: 5px; justify-items: center; color: #9fa9ba; font-size: 9px; }
    .metrics { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-top: 12px; }
    .metric { padding: 9px; border: 1px solid #303541; border-radius: 7px; background: #181c23; }
    .metric strong { display: block; font-size: 16px; }
    .metric span { color: #9da6b7; font-size: 10px; }
    .scope { margin-top: 10px; color: #9da6b7; font-size: 11px; }
    .empty { padding: 50px; text-align: center; color: #333b49; font-weight: 700; }
  </style>
</head>
<body>
  <header>
    <h1>Production Roll v1 versus Wildcard</h1>
    <div class="subtitle">120 balanced pairs - Form shading - Effects Off - transparent canvases - approved production-v1 corpus frozen 2026-07-26</div>
    <div class="filters">
      <label>Roll view<select id="roll-type"><option value="both">Production + Wildcard</option><option value="production">Production only</option><option value="wildcard">Wildcard only</option></select></label>
      <label>Class pairing<select id="class-filter"></select></label>
      <label>Power tier<select id="tier-filter"></select></label>
      <label>Species<select id="species-filter"></select></label>
      <label>Headgear coverage<select id="headgear-filter"></select></label>
      <label>Equipment type<select id="equipment-filter"></select></label>
      <label>Complexity used<select id="complexity-filter"></select></label>
      <label>Rule / fallback reason<select id="reason-filter"></select></label>
      <label>Background<select id="background"><option value="parchment">Parchment #e8ddc4</option><option value="dark">Dark #191b22</option></select></label>
    </div>
    <div class="playback">
      <label>Matching pair<select id="pair"></select></label>
      <label>Direction<select id="direction"></select></label>
      <label>Animation<select id="animation"></select></label>
      <label>Frame<input id="frame" type="range" min="0" value="1"></label>
      <button id="next" type="button">Next pair</button>
      <button id="cycle" type="button">Cycle frames</button>
    </div>
  </header>
  <main>
    <div class="notice"><span id="readout"></span><span>This fixed corpus received explicit visual approval; automated validity remains a separate structural claim.</span></div>
    <section id="review-stage">
      <div id="empty" class="empty" hidden>No pairs match these filters.</div>
      <section class="roll-section" data-roll-section="production">
        <div class="roll-heading"><h2>Production Roll</h2><span data-meta="production"></span></div>
        <div class="treatments">
          <article class="card"><h3>Form - None</h3><p>Approved shade without an assembled outline.</p><div class="canvas-row"><div class="zoom-wrap"><canvas class="zoom" data-roll="production" data-treatment="none" width="24" height="24"></canvas></div><div class="native-label"><canvas class="native" data-roll="production" data-treatment="none" width="24" height="24"></canvas>24x24</div></div></article>
          <article class="card"><h3>Form - Complete B</h3><p>Strong approved assembled outline geometry.</p><div class="canvas-row"><div class="zoom-wrap"><canvas class="zoom" data-roll="production" data-treatment="complete-b" width="24" height="24"></canvas></div><div class="native-label"><canvas class="native" data-roll="production" data-treatment="complete-b" width="24" height="24"></canvas>24x24</div></div></article>
          <article class="card"><h3>Form - Selective C</h3><p>Light approved assembled outline geometry.</p><div class="canvas-row"><div class="zoom-wrap"><canvas class="zoom" data-roll="production" data-treatment="selective-c" width="24" height="24"></canvas></div><div class="native-label"><canvas class="native" data-roll="production" data-treatment="selective-c" width="24" height="24"></canvas>24x24</div></div></article>
        </div>
      </section>
      <section class="roll-section" data-roll-section="wildcard">
        <div class="roll-heading"><h2>Wildcard control</h2><span data-meta="wildcard"></span></div>
        <div class="treatments">
          <article class="card"><h3>Form - None</h3><p>Same seed label, unrestricted whole-player randomizer.</p><div class="canvas-row"><div class="zoom-wrap"><canvas class="zoom" data-roll="wildcard" data-treatment="none" width="24" height="24"></canvas></div><div class="native-label"><canvas class="native" data-roll="wildcard" data-treatment="none" width="24" height="24"></canvas>24x24</div></div></article>
          <article class="card"><h3>Form - Complete B</h3><p>Strong approved assembled outline geometry.</p><div class="canvas-row"><div class="zoom-wrap"><canvas class="zoom" data-roll="wildcard" data-treatment="complete-b" width="24" height="24"></canvas></div><div class="native-label"><canvas class="native" data-roll="wildcard" data-treatment="complete-b" width="24" height="24"></canvas>24x24</div></div></article>
          <article class="card"><h3>Form - Selective C</h3><p>Light approved assembled outline geometry.</p><div class="canvas-row"><div class="zoom-wrap"><canvas class="zoom" data-roll="wildcard" data-treatment="selective-c" width="24" height="24"></canvas></div><div class="native-label"><canvas class="native" data-roll="wildcard" data-treatment="selective-c" width="24" height="24"></canvas>24x24</div></div></article>
        </div>
      </section>
    </section>
    <section class="metrics">
      <div class="metric"><strong>${report.totals.pairs}</strong><span>balanced pairs</span></div>
      <div class="metric"><strong>${report.totals.frameCases}</strong><span>machine-audited frames</span></div>
      <div class="metric"><strong>${report.totals.treatmentCases}</strong><span>Form/outline cases</span></div>
      <div class="metric"><strong>${report.totals.discardedWrites}</strong><span>discarded writes</span></div>
      <div class="metric"><strong>${report.totals.attachmentChecks}</strong><span>equipment checks</span></div>
      <div class="metric"><strong>${report.failures.length}</strong><span>automated failures</span></div>
    </section>
    <div class="scope">Scope: 12 pairs per class x 10 classes x Production/Wildcard x 4 directions x idle/walk/attack/cast/hurt/death x every frame x None/Complete B/Selective C. Parchment and dark are review-only backgrounds.</div>
  </main>
  <script type="module">
    import * as E from '../sprite-engine.js';

    const pairs = ${pairsJson};
    const summary = ${reportSummaryJson};
    const treatments = {
      'none': E.OUTLINE_MODE_NONE,
      'complete-b': E.OUTLINE_MODE_COMPLETE_B,
      'selective-c': E.OUTLINE_MODE_SELECTIVE_C,
    };
    const controls = {
      rollType: document.querySelector('#roll-type'),
      classFilter: document.querySelector('#class-filter'),
      tierFilter: document.querySelector('#tier-filter'),
      speciesFilter: document.querySelector('#species-filter'),
      headgearFilter: document.querySelector('#headgear-filter'),
      equipmentFilter: document.querySelector('#equipment-filter'),
      complexityFilter: document.querySelector('#complexity-filter'),
      reasonFilter: document.querySelector('#reason-filter'),
      background: document.querySelector('#background'),
      pair: document.querySelector('#pair'),
      direction: document.querySelector('#direction'),
      animation: document.querySelector('#animation'),
      frame: document.querySelector('#frame'),
    };
    const stage = document.querySelector('#review-stage');
    const empty = document.querySelector('#empty');
    const nextButton = document.querySelector('#next');
    const cycleButton = document.querySelector('#cycle');
    let filteredPairs = [...pairs];
    let cycleTimer = null;

    function addOptions(select, values, allLabel = 'All') {
      select.add(new Option(allLabel, 'all'));
      for (const value of [...new Set(values)].sort((left, right) => String(left).localeCompare(String(right)))) {
        select.add(new Option(String(value), String(value)));
      }
    }

    addOptions(controls.classFilter, pairs.map((pair) => pair.pairedClass));
    addOptions(controls.tierFilter, pairs.flatMap((pair) => [pair.production.powerTier, pair.wildcard.powerTier]));
    addOptions(controls.speciesFilter, pairs.flatMap((pair) => [pair.production.player.species, pair.wildcard.player.species]));
    addOptions(controls.headgearFilter, pairs.flatMap((pair) => [pair.production.headgearCoverage, pair.wildcard.headgearCoverage]));
    addOptions(controls.equipmentFilter, pairs.flatMap((pair) => [pair.production.equipmentType, pair.wildcard.equipmentType]));
    addOptions(controls.complexityFilter, pairs.flatMap((pair) => [pair.production.complexityUsage, pair.wildcard.complexityUsage]));
    addOptions(controls.reasonFilter, pairs.flatMap((pair) => [...pair.production.ruleReasons, ...pair.wildcard.ruleReasons]));
    for (const direction of E.DIRS) controls.direction.add(new Option(direction.toUpperCase(), direction));
    for (const animation of E.ANIMS) controls.animation.add(new Option(animation.name, animation.id));
    controls.animation.value = 'attack';

    function selectedReviews(pair) {
      if (controls.rollType.value === 'production') return [pair.production];
      if (controls.rollType.value === 'wildcard') return [pair.wildcard];
      return [pair.production, pair.wildcard];
    }

    function matchesReview(review) {
      return (controls.classFilter.value === 'all' || review.pairedClass === controls.classFilter.value)
        && (controls.tierFilter.value === 'all' || review.powerTier === controls.tierFilter.value)
        && (controls.speciesFilter.value === 'all' || review.player.species === controls.speciesFilter.value)
        && (controls.headgearFilter.value === 'all' || review.headgearCoverage === controls.headgearFilter.value)
        && (controls.equipmentFilter.value === 'all' || review.equipmentType === controls.equipmentFilter.value)
        && (controls.complexityFilter.value === 'all' || String(review.complexityUsage) === controls.complexityFilter.value)
        && (controls.reasonFilter.value === 'all' || review.ruleReasons.includes(controls.reasonFilter.value));
    }

    function applyFilters() {
      const previous = controls.pair.value;
      filteredPairs = pairs.filter((pair) => selectedReviews(pair).some(matchesReview));
      controls.pair.replaceChildren();
      for (const pair of filteredPairs) {
        controls.pair.add(new Option(pair.id + ' - ' + pair.seed, pair.id));
      }
      if (filteredPairs.some((pair) => pair.id === previous)) controls.pair.value = previous;
      render();
    }

    function animation() {
      return E.ANIMS.find((entry) => entry.id === controls.animation.value) || E.ANIMS[0];
    }

    function currentPair() {
      return filteredPairs.find((pair) => pair.id === controls.pair.value) || filteredPairs[0];
    }

    function currentFrame() {
      return Math.min(Number(controls.frame.value), animation().frames - 1);
    }

    function drawCanvas(canvas, review) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, E.SIZE, E.SIZE);
      context.imageSmoothingEnabled = false;
      E.drawAssembledSprite(
        context,
        review.player,
        controls.direction.value,
        animation().id,
        currentFrame(),
        {
          shadow: false,
          shadeMode: E.SHADE_MODE_FORM,
          outlineMode: treatments[canvas.dataset.treatment],
        },
      );
    }

    function describeReview(review) {
      return review.player.species
        + ' - ' + review.player.outfit + ' ' + review.powerTier
        + ' - ' + review.player.weapon
        + (review.player.shield !== 'none' ? ' + ' + review.player.shield : '')
        + (review.player.offhand !== 'none' ? ' + ' + review.player.offhand : '')
        + ' - complexity ' + review.complexityUsage
        + ' - reasons ' + review.ruleReasons.join(', ');
    }

    function render() {
      const pair = currentPair();
      const hasPair = Boolean(pair);
      empty.hidden = hasPair;
      for (const section of document.querySelectorAll('[data-roll-section]')) {
        const roll = section.dataset.rollSection;
        section.hidden = !hasPair || (controls.rollType.value !== 'both' && controls.rollType.value !== roll);
      }
      if (!pair) {
        document.querySelector('#readout').textContent = 'No matching review pairs';
        return;
      }
      controls.frame.max = String(animation().frames - 1);
      if (Number(controls.frame.value) > animation().frames - 1) controls.frame.value = '0';
      for (const canvas of document.querySelectorAll('canvas[data-roll]')) {
        drawCanvas(canvas, pair[canvas.dataset.roll]);
      }
      document.querySelector('[data-meta="production"]').textContent = describeReview(pair.production);
      document.querySelector('[data-meta="wildcard"]').textContent = describeReview(pair.wildcard);
      document.querySelector('#readout').textContent =
        pair.id + ' - ' + pair.seed + ' - ' + controls.direction.value.toUpperCase()
        + ' - ' + animation().name + ' - frame ' + (currentFrame() + 1) + '/' + animation().frames;
      stage.classList.toggle('dark', controls.background.value === 'dark');
    }

    function nextPair() {
      if (!filteredPairs.length) return;
      const index = filteredPairs.findIndex((pair) => pair.id === controls.pair.value);
      controls.pair.value = filteredPairs[(index + 1) % filteredPairs.length].id;
      render();
    }

    function advanceFrame() {
      const next = currentFrame() + 1;
      controls.frame.value = String(next < animation().frames ? next : 0);
      render();
    }

    function toggleCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
        cycleButton.classList.remove('active');
        cycleButton.textContent = 'Cycle frames';
      } else {
        cycleTimer = setInterval(advanceFrame, 650);
        cycleButton.classList.add('active');
        cycleButton.textContent = 'Pause cycle';
      }
    }

    for (const control of [
      controls.rollType,
      controls.classFilter,
      controls.tierFilter,
      controls.speciesFilter,
      controls.headgearFilter,
      controls.equipmentFilter,
      controls.complexityFilter,
      controls.reasonFilter,
    ]) control.addEventListener('input', applyFilters);
    for (const control of [
      controls.background,
      controls.pair,
      controls.direction,
      controls.animation,
      controls.frame,
    ]) control.addEventListener('input', render);
    nextButton.addEventListener('click', nextPair);
    cycleButton.addEventListener('click', toggleCycle);
    applyFilters();
  </script>
</body>
</html>`;

await writeFile(path.join(output, 'index.html'), html, 'utf8');
await writeFile(path.join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (report.failures.length) {
  console.error(
    `Production Roll review failed with ${report.failures.length} error`
    + `${report.failures.length === 1 ? '' : 's'}:`,
  );
  for (const failure of report.failures.slice(0, 100)) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Production versus Wildcard review generated.');
console.log(`- Balanced pairs: ${report.totals.pairs}`);
console.log(`- Production cases: ${report.totals.productionCases}`);
console.log(`- Wildcard controls: ${report.totals.wildcardCases}`);
console.log(`- Audited frames: ${report.totals.frameCases}`);
console.log(`- Form/outline cases: ${report.totals.treatmentCases}`);
console.log(`- Deterministic cases: ${report.totals.deterministicCases}`);
console.log(`- Equipment attachment checks: ${report.totals.attachmentChecks}`);
console.log(`- Discarded writes: ${report.totals.discardedWrites}`);
console.log(`- Corpus digest: ${report.corpusDigest}`);
console.log(`- Review: ${path.join(output, 'index.html')}`);
