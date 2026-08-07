import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_GIANT_HURT_GATE, EN_E03_GIANT_HURT_REGISTRY } from '../engine/enemy-expansion-en-e03-giant-hurt.js';
import { EN_E03_CENTAUR_HURT_GATE, EN_E03_CENTAUR_HURT_REGISTRY } from '../engine/enemy-expansion-en-e03-centaur-hurt.js';
import { EN_E03_SATYR_HURT_GATE, EN_E03_SATYR_HURT_REGISTRY } from '../engine/enemy-expansion-en-e03-satyr-hurt.js';
import {
  EN_E03_COMMON_ALIAS_GATE,
  EN_E03_COMMON_ALIAS_REGISTRY,
  EN_E03_DEATH_SOURCE_FRAMES,
} from '../engine/enemy-expansion-en-e03-common-aliases.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) { if (!condition) errors.push(message); }

function rejects(run, messageFragment, label) {
  try {
    run();
    errors.push(label + ' was not rejected.');
  } catch (error) {
    check(String(error.message).includes(messageFragment), label + ' returned the wrong error: ' + error.message);
  }
}

function frameRecord(captured, family, variant, direction, animation, frame) {
  return {
    family, variant, direction, animation, frame,
    digest: captured.digest, alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels, bounds: captured.bounds,
  };
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

const families = [
  { family: 'giant', variant: 'hill-breaker', sourceRegistry: EN_E03_GIANT_HURT_REGISTRY, sourceGate: EN_E03_GIANT_HURT_GATE, gateKey: 'hillBreaker' },
  { family: 'centaur', variant: 'steppe-hunter', sourceRegistry: EN_E03_CENTAUR_HURT_REGISTRY, sourceGate: EN_E03_CENTAUR_HURT_GATE, gateKey: 'steppeHunter' },
  { family: 'satyr', variant: 'briar-reveler', sourceRegistry: EN_E03_SATYR_HURT_REGISTRY, sourceGate: EN_E03_SATYR_HURT_GATE, gateKey: 'briarReveler' },
];

for (const family of families) check(family.sourceGate.status === 'approved', family.variant + ' Hurt source gate must remain visually approved');
check(EN_E03_SATYR_HURT_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Briar Reveler Hurt animations together and said: approved lets do next.', 'the preceding Briar Reveler Hurt approval evidence must remain exact');
check(EN_E03_COMMON_ALIAS_GATE.status === 'approved', 'the common alias gate must retain direct visual approval');
check(EN_E03_COMMON_ALIAS_GATE.authorizedOn === '2026-08-07', 'the common alias gate must retain its authorization date');
check(EN_E03_COMMON_ALIAS_GATE.authorizationEvidence.includes('approved lets do next') && EN_E03_COMMON_ALIAS_GATE.authorizationEvidence.includes('common Cast/Death aliases'), 'the common alias gate must retain the bounded authorization evidence');
check(EN_E03_COMMON_ALIAS_GATE.approvedOn === '2026-08-07', 'the common alias gate must retain its visual approval date');
check(EN_E03_COMMON_ALIAS_GATE.approvalEvidence === 'Designer reviewed the exact labeled all-four-direction Cast raw, Cast Complete B + Form, Death raw, and Death Complete B + Form GIFs together and said: approved.', 'the common alias gate must retain the exact four-GIF approval evidence');
check(EN_E03_COMMON_ALIAS_GATE.precedingApproval.gateId === EN_E03_SATYR_HURT_GATE.id, 'the alias gate must identify the approved Briar Hurt predecessor');
check(EN_E03_COMMON_ALIAS_GATE.precedingApproval.artifactSha256 === EN_E03_SATYR_HURT_GATE.artifactSha256, 'the preceding raw Briar Hurt hash must remain frozen');
check(EN_E03_COMMON_ALIAS_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_SATYR_HURT_GATE.assembledArtifactSha256, 'the preceding assembled Briar Hurt hash must remain frozen');
check(EN_E03_COMMON_ALIAS_GATE.precedingApproval.candidateFrameDigest === EN_E03_SATYR_HURT_GATE.candidateFrameDigest, 'the preceding Briar Hurt digest must remain frozen');
for (const family of families) {
  const approved = EN_E03_COMMON_ALIAS_GATE.approvedCommonBaselines[family.gateKey];
  check(approved.gateId === family.sourceGate.id, family.variant + ' approved Hurt gate id must remain exact');
  check(approved.artifactSha256 === family.sourceGate.artifactSha256, family.variant + ' raw Hurt hash must remain exact');
  check(approved.assembledArtifactSha256 === family.sourceGate.assembledArtifactSha256, family.variant + ' assembled Hurt hash must remain exact');
  check(approved.frameDigest === family.sourceGate.candidateFrameDigest, family.variant + ' Hurt digest must remain exact');
}
check(EN_E03_COMMON_ALIAS_GATE.artifactSha256.length === 64, 'the raw alias board hash must be frozen');
check(EN_E03_COMMON_ALIAS_GATE.assembledArtifactSha256.length === 64, 'the Complete B + Form alias board hash must be frozen');
check(EN_E03_COMMON_ALIAS_GATE.candidateFrameDigest.length === 64, 'the 96-frame alias digest must be frozen');
for (const animation of Object.values(EN_E03_COMMON_ALIAS_GATE.reviewAnimations)) {
  check(animation.sha256.length === 64, 'each common alias GIF hash must be frozen');
  check(animation.width === 576 && animation.height === 224 && animation.frames === 4 && animation.durationMs === 480, 'each common alias GIF must retain the 576x224 four-frame 480 ms contract');
}
check(EN_E03_COMMON_ALIAS_GATE.scope.includes('Hill Breaker, Steppe Hunter, and Briar Reveler'), 'the alias gate must name all three and only the approved common variants');
check(EN_E03_COMMON_ALIAS_GATE.aliasContract.includes('Attack A1-A4 frame-for-frame') && EN_E03_COMMON_ALIAS_GATE.aliasContract.includes('Hurt H1,H2,H2,H2') && EN_E03_COMMON_ALIAS_GATE.aliasContract.includes('no new sprite pixels'), 'the alias gate must encode both exact source mappings and no-new-pixels rule');
check(EN_E03_COMMON_ALIAS_GATE.reviewPresentation.includes('four labeled all-four-direction, three-family GIFs') && EN_E03_COMMON_ALIAS_GATE.reviewPresentation.includes('raw/no-outline') && EN_E03_COMMON_ALIAS_GATE.reviewPresentation.includes('Complete B + Form'), 'the alias gate must retain the four-GIF review contract');
check(EN_E03_COMMON_ALIAS_GATE.exclusions.includes('new sprite pixels') && EN_E03_COMMON_ALIAS_GATE.exclusions.includes('specialist variants') && EN_E03_COMMON_ALIAS_GATE.exclusions.includes('registration') && EN_E03_COMMON_ALIAS_GATE.exclusions.includes('release'), 'the alias gate must exclude pixels, variants, integration, and release');
check(EN_E03_COMMON_ALIAS_GATE.nextGate.includes('Visual approval is complete') && EN_E03_COMMON_ALIAS_GATE.nextGate.includes('No registration, integration, variants, effects, release, or later EN-E03 work is authorized'), 'the approved alias gate must stop before later integration or expansion');
check(JSON.stringify(EN_E03_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Enemy Death must map exactly to Hurt H1,H2,H2,H2');
check(EN_E03_COMMON_ALIAS_REGISTRY.families.length === 3, 'the alias registry must contain exactly three common families');
check(EN_E03_COMMON_ALIAS_REGISTRY.families.every((family) => family.state === 'implemented' && family.variants.length === 1), 'each alias family must remain internal with exactly one common variant');
check(EN_E03_COMMON_ALIAS_REGISTRY.publicFamilies.length === 0, 'the alias registry must expose zero public families');
check(engine.EN_E03_COMMON_ALIAS_REGISTRY === undefined && engine.EN_E03_COMMON_ALIAS_GATE === undefined, 'the alias candidate must not leak through the public engine facade');

check(await sha256File(EN_E03_COMMON_ALIAS_GATE.artifact) === EN_E03_COMMON_ALIAS_GATE.artifactSha256, 'the raw alias board on disk must match the frozen hash');
check(await sha256File(EN_E03_COMMON_ALIAS_GATE.assembledArtifact) === EN_E03_COMMON_ALIAS_GATE.assembledArtifactSha256, 'the Complete B + Form alias board on disk must match the frozen hash');
for (const animation of Object.values(EN_E03_COMMON_ALIAS_GATE.reviewAnimations)) check(await sha256File(animation.artifact) === animation.sha256, animation.artifact + ' must match the frozen GIF hash');

let delegatedFrames = 0;
let castAliasFrames = 0;
let deathAliasFrames = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
const candidateRecords = [];

for (const family of families) {
  const spec = { kind: 'enemy', family: family.family, variant: family.variant };
  for (const [animation, frameCount] of [['idle', 2], ['walk', 4], ['attack', 4], ['hurt', 2]]) {
    for (const direction of engine.DIRS) for (let frame = 0; frame < frameCount; frame++) {
      const source = captureEnemyExpansionFrame(family.sourceRegistry, spec, direction, animation, frame, engine.SIZE);
      const delegated = captureEnemyExpansionFrame(EN_E03_COMMON_ALIAS_REGISTRY, spec, direction, animation, frame, engine.SIZE);
      check(JSON.stringify(delegated.pixels) === JSON.stringify(source.pixels), family.variant + '/' + direction + '/' + animation + '/' + frame + ' must delegate byte-for-byte');
      check(delegated.digest === source.digest && delegated.alphaDigest === source.alphaDigest, family.variant + '/' + direction + '/' + animation + '/' + frame + ' hashes must remain exact');
      delegatedFrames++;
    }
  }
  const rendererData = EN_E03_COMMON_ALIAS_REGISTRY.families.find((entry) => entry.id === family.family).variants[0].rendererData;
  for (const animation of ['cast', 'death']) for (const direction of engine.DIRS) for (let frame = 0; frame < 4; frame++) {
    const alias = captureEnemyExpansionFrame(EN_E03_COMMON_ALIAS_REGISTRY, spec, direction, animation, frame, engine.SIZE);
    const sourceAnimation = animation === 'cast' ? 'attack' : 'hurt';
    const sourceFrame = animation === 'cast' ? frame : EN_E03_DEATH_SOURCE_FRAMES[frame];
    const source = captureEnemyExpansionFrame(family.sourceRegistry, spec, direction, sourceAnimation, sourceFrame, engine.SIZE);
    check(JSON.stringify(alias.pixels) === JSON.stringify(source.pixels), family.variant + '/' + direction + '/' + animation + '/' + frame + ' must contain no pixels beyond its approved source');
    check(alias.digest === source.digest && alias.alphaDigest === source.alphaDigest, family.variant + '/' + direction + '/' + animation + '/' + frame + ' must hash exactly to ' + sourceAnimation + '/' + sourceFrame);
    check(alias.outOfBoundsWrites.length === 0 && alias.alpha.every((value) => value === 0 || value === 255), family.variant + '/' + direction + '/' + animation + '/' + frame + ' must retain hard alpha and frame safety');
    check(alias.bounds && alias.bounds.minX >= 1 && alias.bounds.minY >= 1 && alias.bounds.maxX <= 22 && alias.bounds.maxY <= 22, family.variant + '/' + direction + '/' + animation + '/' + frame + ' must retain a one-cell margin');
    check(alias.renderResult.animation === animation && alias.renderResult.frame === frame, family.variant + '/' + animation + '/' + frame + ' must report the requested alias frame');
    check(alias.renderResult.renderedAnimation === sourceAnimation && alias.renderResult.renderedFrame === sourceFrame, family.variant + '/' + animation + '/' + frame + ' must report its exact approved source frame');
    check(alias.renderResult.commonAliasGate === EN_E03_COMMON_ALIAS_GATE.id && alias.renderResult.approvedSourceGate === family.sourceGate.id, family.variant + '/' + animation + '/' + frame + ' must report both gate ids');
    const presentation = buildEnemyExpansionCandidatePresentation(alias.pixels, rendererData);
    completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && alias.pixels[index] === null).length;
    formChangedPixels += presentation.form.filter((color, index) => alias.pixels[index] !== null && color !== alias.pixels[index]).length;
    candidateRecords.push(frameRecord(alias, family.family, family.variant, direction, animation, frame));
    if (animation === 'cast') castAliasFrames++;
    else deathAliasFrames++;
  }
}

const expectedRecordOrder = [];
for (const family of families) for (const animation of ['cast', 'death']) for (const direction of engine.DIRS) for (let frame = 0; frame < 4; frame++) expectedRecordOrder.push(family.family + '/' + animation + '/' + direction + '/' + frame);
check(JSON.stringify(candidateRecords.map((record) => record.family + '/' + record.animation + '/' + record.direction + '/' + record.frame)) === JSON.stringify(expectedRecordOrder), 'the alias digest records must retain deterministic family/animation/direction/frame order');
const candidateDigest = createHash('sha256').update(JSON.stringify(candidateRecords)).digest('hex');
check(candidateDigest === EN_E03_COMMON_ALIAS_GATE.candidateFrameDigest, 'the common Cast/Death alias frames drifted');
check(delegatedFrames === 144, 'all 144 approved Idle/Walk/Attack/Hurt context frames must delegate exactly');
check(castAliasFrames === 48 && deathAliasFrames === 48, 'the gate must validate 48 Cast and 48 Death alias frames');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the alias review set');
check(formChangedPixels > 0, 'Form must shade source pixels across the alias review set');

rejects(() => engine.renderEnemyExpansionFrame(EN_E03_COMMON_ALIAS_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'boulder-hurler' }, 'down', 'cast', 0, {}), 'is not implemented', 'Giant specialist alias rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_COMMON_ALIAS_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'sun-lancer' }, 'down', 'death', 0, {}), 'is not implemented', 'Centaur specialist alias rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_COMMON_ALIAS_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'reed-charmer' }, 'down', 'cast', 0, {}), 'is not implemented', 'Satyr specialist alias rendering');

if (errors.length) {
  console.error('EN-E03 common Cast/Death alias validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 common Cast/Death alias validation passed.');
console.log('- Approved context frames preserved: ' + delegatedFrames + ' / 144');
console.log('- Cast-to-Attack aliases: ' + castAliasFrames + ' / 48');
console.log('- Death-to-Hurt H1,H2,H2,H2 aliases: ' + deathAliasFrames + ' / 48');
console.log('- New sprite pixels: 0');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
