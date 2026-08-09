import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E02_CANDIDATE_FAMILIES,
  EN_E02_CANDIDATE_REGISTRY,
  EN_E02_CONTRACT_CARDS,
  EN_E02_FULL_PRODUCTION_GATE,
  EN_E02_IDLE_GATE,
} from '../engine/enemy-expansion-en-e02.js';
import {
  captureEnemyExpansionFrame,
} from './enemy-expansion-review-pixels.mjs';
import {
  buildEnemyExpansionCandidatePresentation,
} from './enemy-expansion-candidate-presentation.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function samePixels(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function outlineReport(source, outlined) {
  let addedPixels = 0;
  let sourcePreserved = true;
  let outlineColorOnly = true;
  for (let index = 0; index < source.length; index++) {
    if (source[index] !== null) {
      if (outlined[index] !== source[index]) sourcePreserved = false;
    } else if (outlined[index] !== null) {
      addedPixels++;
      if (outlined[index] !== engine.OUTLINE_COLOR) outlineColorOnly = false;
    }
  }
  return { addedPixels, sourcePreserved, outlineColorOnly };
}

function shadeReport(source, before, shaded, protectedMask) {
  let changedPixels = 0;
  let validColors = true;
  let sourceOwnedChanges = true;
  let protectedPixelsPreserved = true;
  let outlinePixelsPreserved = true;
  for (let index = 0; index < source.length; index++) {
    const sourceColor = source[index];
    const beforeColor = before[index];
    const shadedColor = shaded[index];
    if (shadedColor !== null && !/^#[0-9a-f]{6}$/.test(shadedColor)) validColors = false;
    if (beforeColor !== sourceColor && shadedColor !== beforeColor) outlinePixelsPreserved = false;
    if (shadedColor === beforeColor) continue;
    changedPixels++;
    if (sourceColor === null) sourceOwnedChanges = false;
    if (protectedMask[index]) protectedPixelsPreserved = false;
  }
  return { changedPixels, validColors, sourceOwnedChanges, protectedPixelsPreserved, outlinePixelsPreserved };
}

const expectedFamilies = ['catfolk', 'desert-raider', 'fanatic-monk', 'goatfolk', 'plague-doctor'];
const expectedVariants = {
  'plague-doctor': ['field-chirurgeon', 'leech-warden', 'pestilent-magister'],
  'desert-raider': ['dune-reaver', 'sandbow-stalker', 'sunscar-captain'],
  'fanatic-monk': ['ash-disciple', 'chain-penitent', 'bell-abbot'],
  catfolk: ['alley-prowler', 'moonclaw-duelist', 'pride-champion'],
  goatfolk: ['crag-skirmisher', 'horn-seer', 'ramguard-chieftain'],
};

check(EN_E02_IDLE_GATE.status === 'approved', 'full production must retain the exact approved EN-E02 Idle gate');
check(EN_E02_FULL_PRODUCTION_GATE.status === 'authorized', 'full EN-E02 production must have explicit authorization');
check(EN_E02_FULL_PRODUCTION_GATE.authorizedOn === '2026-08-02', 'full EN-E02 production must record its authorization date');
check(Object.isFrozen(EN_E02_FULL_PRODUCTION_GATE) && Object.isFrozen(EN_E02_FULL_PRODUCTION_GATE.exclusions), 'the EN-E02 full-production authorization must be deeply immutable');
check(EN_E02_FULL_PRODUCTION_GATE.exclusions.includes('public registration') && EN_E02_FULL_PRODUCTION_GATE.exclusions.includes('separate effect assets'), 'full EN-E02 authorization must preserve registration and effect exclusions');
check(EN_E02_CANDIDATE_FAMILIES.length === 5, 'full EN-E02 needs five candidate families');
check(JSON.stringify(EN_E02_CANDIDATE_REGISTRY.families.map((family) => family.id)) === JSON.stringify(expectedFamilies), 'full EN-E02 family order must be deterministic');
check(EN_E02_CANDIDATE_REGISTRY.renderers.length === 1, 'all full EN-E02 variants must share one renderer');
check(EN_E02_CANDIDATE_REGISTRY.renderers[0].key === 'humanoid-threat-v1', 'full EN-E02 must retain the approved renderer key');
check(EN_E02_CANDIDATE_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'full EN-E02 must retain the approved chassis');
check(EN_E02_CANDIDATE_REGISTRY.publicFamilies.length === 0, 'full EN-E02 candidates must remain outside the public family view');
check(EN_E02_CANDIDATE_REGISTRY.approvedFamilies.length === 0, 'full EN-E02 candidates must not claim completed-family approval');
check(engine.ENEMY_EXPANSION_REGISTRY.families.length === 17, 'the later EN-E05 registration must extend the cumulative stable registry to seventeen approved families');
check(engine.PUBLIC_ENEMIES.length === 74, 'the public consumer catalog must contain the authorized 74 families after EN-E05 integration');
check(engine.ENEMIES.length === 57, 'the legacy Enemy catalog must remain at 57 families');
check(Object.isFrozen(EN_E02_CANDIDATE_REGISTRY), 'the full EN-E02 registry must be immutable');

const sandbowStalker = EN_E02_CANDIDATE_REGISTRY.families
  .find((family) => family.id === 'desert-raider')?.variants
  .find((variant) => variant.id === 'sandbow-stalker');
check(sandbowStalker?.rendererData?.actor?.weapon === 'none', 'Sandbow Stalker must not use the stock bow layer that bakes a released arrow');
check(sandbowStalker?.rendererData?.identity?.overlays?.some((overlay) => overlay.id === 'sandbow'), 'Sandbow Stalker needs the projectile-free actor-owned bow/string treatment');

for (const card of EN_E02_CONTRACT_CARDS) {
  const family = EN_E02_CANDIDATE_REGISTRY.families.find((entry) => entry.id === card.id);
  check(Boolean(family), 'missing full candidate family ' + card.id);
  if (!family) continue;
  check(family.state === engine.ENEMY_EXPANSION_STATES.IMPLEMENTED, card.id + ' candidate evidence must remain implemented rather than approved');
  check(card.additionalVariants?.length === 2, card.id + ' needs exactly specialist and elite renderer data');
  check(JSON.stringify(family.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[card.id]), card.id + ' must register common, specialist, elite in authorized brief order');
  check(JSON.stringify(card.variantBriefs.map((variant) => variant.role)) === JSON.stringify(['common', 'specialist', 'elite']), card.id + ' roles must remain common, specialist, elite');
  check(family.variants.every((variant) => variant.rendererData?.actor && Array.isArray(variant.rendererData?.identity?.overlays)), card.id + ' variants need complete actor and identity renderer data');
  check(family.variants.every((variant) => !/\b(effect|projectile|summon|miasma|motes|dust trail|slash trail|bell wave|shock ring)\b/i.test(JSON.stringify(variant.rendererData))), card.id + ' renderer data must not bake external effects or child assets');
}

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(facadeSource.includes('enemy-expansion-public.js'), 'the public facade must retain the approved expansion boundary');
check(!facadeSource.includes('enemy-expansion-en-e02'), 'the public facade must not import EN-E02 implementation details');
check(!facadeSource.includes('EN_E02_'), 'the public facade must not expose EN-E02 implementation symbols');

const frameByKey = new Map();
const frameRecords = [];
const sheetResults = [];
let presentationFrames = 0;
let outlineModeCases = 0;
let completeOutlinePixels = 0;
let selectiveOutlinePixels = 0;
let shadeModeCases = 0;
let shadeChangedPixels = 0;
let protectedShadePixels = 0;
for (const card of EN_E02_CONTRACT_CARDS) {
  for (const variantBrief of card.variantBriefs) {
    const spec = { kind: 'enemy', family: card.id, variant: variantBrief.id };
    const candidateVariant = EN_E02_CANDIDATE_REGISTRY.families
      .find((family) => family.id === card.id).variants
      .find((variant) => variant.id === variantBrief.id);
    const sheetFrames = [];
    for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const rendered = captureEnemyExpansionFrame(EN_E02_CANDIDATE_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
        const repeated = captureEnemyExpansionFrame(EN_E02_CANDIDATE_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
        const prefix = card.id + '/' + variantBrief.id + '/' + direction + '/' + animation.id + '/' + frame;
        check(rendered.digest === repeated.digest, prefix + ' must render deterministically');
        check(rendered.opaquePixels > 0, prefix + ' must not be empty');
        check(rendered.outOfBoundsWrites.length === 0, prefix + ' attempted out-of-bounds drawing');
        check(rendered.colors.every((color) => /^#[0-9a-f]{6}$/i.test(color)), prefix + ' must use opaque six-digit colors only');
        check([...rendered.alpha].every((alpha) => alpha === 0 || alpha === 255), prefix + ' must use binary alpha');
        check(rendered.bounds && rendered.bounds.minX >= 1 && rendered.bounds.maxX <= 22 && rendered.bounds.minY >= 1 && rendered.bounds.maxY <= 22, prefix + ' must retain a one-cell canvas margin');
        check(rendered.renderResult?.animation === animation.id && rendered.renderResult?.frame === frame, prefix + ' returned the wrong requested-frame evidence');
        const presentation = buildEnemyExpansionCandidatePresentation(rendered.pixels, candidateVariant.rendererData);
        const repeatedPresentation = buildEnemyExpansionCandidatePresentation(rendered.pixels, candidateVariant.rendererData);
        const completeReport = outlineReport(presentation.raw, presentation.complete);
        const selectiveReport = outlineReport(presentation.raw, presentation.selective);
        const formReports = [
          ['None', shadeReport(presentation.raw, presentation.raw, presentation.form, presentation.protectedMask)],
          ['Complete B', shadeReport(presentation.raw, presentation.complete, presentation.formComplete, presentation.protectedMask)],
          ['Selective C', shadeReport(presentation.raw, presentation.selective, presentation.formSelective, presentation.protectedMask)],
        ];
        check(completeReport.sourcePreserved && completeReport.outlineColorOnly && completeReport.addedPixels > 0, prefix + ' Complete B must add only contour pixels');
        check(selectiveReport.sourcePreserved && selectiveReport.outlineColorOnly && selectiveReport.addedPixels > 0, prefix + ' Selective C must add only contour pixels');
        check(!samePixels(presentation.complete, presentation.selective), prefix + ' Complete B and Selective C must remain visibly distinct');
        check(samePixels(presentation.form, repeatedPresentation.form) && samePixels(presentation.formComplete, repeatedPresentation.formComplete), prefix + ' Form presentation must be deterministic');
        for (const [modeName, report] of formReports) {
          check(report.validColors, prefix + ' Form + ' + modeName + ' emitted a non-canonical color');
          check(report.sourceOwnedChanges, prefix + ' Form + ' + modeName + ' changed sprite geometry');
          check(report.protectedPixelsPreserved, prefix + ' Form + ' + modeName + ' changed a protected feature pixel');
          check(report.outlinePixelsPreserved, prefix + ' Form + ' + modeName + ' changed outline geometry');
        }
        presentationFrames++;
        outlineModeCases += 2;
        completeOutlinePixels += completeReport.addedPixels;
        selectiveOutlinePixels += selectiveReport.addedPixels;
        shadeModeCases += formReports.length;
        shadeChangedPixels += formReports[0][1].changedPixels;
        protectedShadePixels += presentation.protectedMask.reduce((total, value, index) => (
          total + (value && presentation.raw[index] !== null ? 1 : 0)
        ), 0);
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

check(frameRecords.length === 1200, 'full EN-E02 must render 1,200 frames across 15 complete sheets');
check(sheetResults.length === 15, 'full EN-E02 must validate 15 complete 480x96 sheets');
check(presentationFrames === 1200, 'EN-E02 must verify outline/Form compatibility for all 1,200 private frames');
check(outlineModeCases === 2400, 'EN-E02 must verify Complete B and Selective C across 2,400 outline cases');
check(completeOutlinePixels > selectiveOutlinePixels, 'Complete B must remain stronger than Selective C across EN-E02');
check(shadeModeCases === 3600, 'EN-E02 must verify Form across None/B/C outlines for 3,600 cases');
check(shadeChangedPixels > 0, 'Form shading must change source-owned EN-E02 pixels');
check(protectedShadePixels > 0, 'Form shading must exercise protected EN-E02 feature pixels');

for (const card of EN_E02_CONTRACT_CARDS) for (const variantBrief of card.variantBriefs) {
  for (const direction of engine.DIRS) {
    const prefix = [card.id, variantBrief.id, direction].join('/');
    const digests = (animationId) => Array.from(
      { length: engine.ANIMS.find((animation) => animation.id === animationId).frames },
      (_, frame) => frameByKey.get(prefix + '/' + animationId + '/' + frame).digest,
    );
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

for (const card of EN_E02_CONTRACT_CARDS) for (const direction of engine.DIRS) {
  const idleSilhouettes = card.variantBriefs.map((variant) => frameByKey.get([card.id, variant.id, direction, 'idle', 0].join('/')).alphaDigest);
  const attackSilhouettes = card.variantBriefs.map((variant) => frameByKey.get([card.id, variant.id, direction, 'attack', 1].join('/')).alphaDigest);
  check(new Set(idleSilhouettes).size === 3, card.id + '/' + direction + ' must keep all three Idle silhouettes distinct');
  check(new Set(attackSilhouettes).size === 3, card.id + '/' + direction + ' must keep all three Attack silhouettes distinct');
}

for (const card of EN_E02_CONTRACT_CARDS) for (const variantBrief of card.variantBriefs) {
  const directionMasks = engine.DIRS.map((direction) => frameByKey.get([card.id, variantBrief.id, direction, 'idle', 0].join('/')).alphaDigest);
  check(new Set(directionMasks).size >= 3, card.id + '/' + variantBrief.id + ' needs readable front, side, and rear silhouettes');
}

const approvedIdleRecords = [];
for (const card of EN_E02_CONTRACT_CARDS) for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const rendered = frameByKey.get([card.id, card.baseline.variantId, direction, 'idle', frame].join('/'));
  approvedIdleRecords.push({ family: card.id, direction, frame, digest: rendered.digest, alphaDigest: rendered.alphaDigest, opaquePixels: rendered.opaquePixels, bounds: rendered.bounds });
}
const approvedIdleDigest = createHash('sha256').update(JSON.stringify(approvedIdleRecords)).digest('hex');
check(approvedIdleDigest === EN_E02_IDLE_GATE.candidateFrameDigest, 'full production changed the exact approved EN-E02 common-baseline Idle frames');

const ledgerReport = engine.buildEnemyExpansionLedgerReport(engine.ENEMY_EXPANSION_LEDGER, EN_E02_CANDIDATE_REGISTRY);
check(ledgerReport.counts.registeredFamilies === 5 && ledgerReport.counts.publicFamilies === 0, 'full EN-E02 ledger evidence must report five internal and zero public families');
const enE02Slice = ledgerReport.slices.find((slice) => slice.id === 'EN-E02');
check(enE02Slice?.state === engine.ENEMY_EXPANSION_STATES.APPROVED && enE02Slice?.registeredFamilies === 5 && enE02Slice?.publicFamilies === 0, 'the frozen full candidate must remain private evidence while the ledger records completed-slice approval');
const fullFrameDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');

if (errors.length) {
  console.error('EN-E02 full candidate validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E02 full candidate validation passed.');
console.log('- Contract cards: 5');
console.log('- Internal variants: 15 (5 common / 5 specialist / 5 elite)');
console.log('- Complete sheets: 15 (480x96)');
console.log('- Reviewed frames: 1,200');
console.log('- Private Complete B / Selective C outline cases: ' + outlineModeCases.toLocaleString('en-US'));
console.log('- Added outline pixels: ' + completeOutlinePixels.toLocaleString('en-US') + ' Complete B / ' + selectiveOutlinePixels.toLocaleString('en-US') + ' Selective C');
console.log('- Private Form shade cases: ' + shadeModeCases.toLocaleString('en-US') + ' across None/B/C outlines');
console.log('- Form shade changes: ' + shadeChangedPixels.toLocaleString('en-US') + ' source-owned pixels; ' + protectedShadePixels.toLocaleString('en-US') + ' protected pixels preserved');
console.log('- Frozen candidate view: 0 approved/public EN-E02 families');
console.log('- Public consumer catalog: 74 families / 245 variants');
console.log('- Approved Idle digest: ' + approvedIdleDigest);
console.log('- Full candidate frame digest: ' + fullFrameDigest);
