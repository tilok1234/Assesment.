import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { capturePixels, renderSpritePixels } from '../engine/pixel-buffer.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E05_REVENANT_GATE,
  EN_E05_REVENANT_REGISTRY,
} from '../engine/enemy-expansion-en-e05-revenant.js';
import {
  EN_E05_LICH_CONTRACT,
  EN_E05_LICH_DATA,
  EN_E05_LICH_DEATH_SOURCE_FRAMES,
  EN_E05_LICH_FAMILY,
  EN_E05_LICH_GATE,
  EN_E05_LICH_REGISTRY,
} from '../engine/enemy-expansion-en-e05-lich.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  mirrorPixels,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const directions = Object.freeze(['down', 'left', 'right', 'up']);
const animations = Object.freeze([
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
]);
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'lich', variant: 'soul-regent' });
const revenantSpec = Object.freeze({ kind: 'enemy', family: 'revenant', variant: 'grave-oathkeeper' });
const expectedZombieDigests = Object.freeze({
  shambler: 'bb97a296f0cfc7090f84197874e70bef9c1f8dd455eb114e045f48ff92caaaa7',
  ghoul: '2eee0fd08ce8d22cc2d5dc3433746d54b64983216d4b800f93119f9ebec5f735',
  rotter: '598ad2775f29d70e70ad41617c9ec2b974f839eef6d9fe68d65479105b1b10bc',
  brute: '0eee8970c49b71190895c5410a7c972b291ef70dda42b31ed5ade56a6e57be32',
});

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.resolve(root, relativePath))).digest('hex');
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
        const nextX = x + dx;
        const nextY = y + dy;
        if (nextX < 0 || nextY < 0 || nextX >= engine.SIZE || nextY >= engine.SIZE) continue;
        const next = (nextY * engine.SIZE) + nextX;
        if (visited[next] || pixels[next] === null) continue;
        visited[next] = 1;
        queue.push(next);
      }
    }
  }
  return count;
}

function countColors(pixels, colors) {
  return pixels.filter((color) => colors.has(color)).length;
}

function candidateFrameRecord(captured, direction, animation, frame) {
  return {
    family: 'lich',
    variant: 'soul-regent',
    candidateFamily: 'lich',
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

function revenantFrameRecord(captured, direction, animation, frame) {
  return {
    family: 'revenant',
    variant: 'grave-oathkeeper',
    candidateFamily: 'revenant',
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

function frameKey(direction, animation, frame) {
  return `${direction}/${animation}/${frame}`;
}

function isWhiteFlash(animation, frame) {
  return (animation === 'hurt' && frame === 0) || (animation === 'death' && frame === 0);
}

check(EN_E05_LICH_GATE.id === 'en-e05-lich-soul-regent-full-v1', 'the Lich Soul Regent gate id drifted');
check(EN_E05_LICH_GATE.status === 'acceptance-candidate', 'the Lich must remain an unapproved acceptance candidate');
check(EN_E05_LICH_GATE.authorizedOn === '2026-08-09', 'the Lich authorization date drifted');
check(EN_E05_LICH_GATE.authorizationEvidence.includes('the designer replied: cool lets do next'), 'the gate must retain the exact designer continuation evidence');
check(EN_E05_LICH_GATE.authorizationEvidence.includes('one separate complete Lich candidate'), 'the gate must retain the bounded Lich authorization');
check(EN_E05_LICH_GATE.precedingApproval.gateId === EN_E05_REVENANT_GATE.id, 'the approved Revenant must remain the preceding gate');
check(EN_E05_LICH_GATE.precedingApproval.publishedImplementation === '7434578d5af8f3e7355add884cf0d33e3f312288', 'the published Revenant implementation checkpoint drifted');
check(EN_E05_LICH_GATE.precedingApproval.publishedHandoff === '97db37e151e04f42367c517955c88826c4ed7f51', 'the reconciled Revenant handoff checkpoint drifted');
check(EN_E05_LICH_CONTRACT.family === 'lich' && EN_E05_LICH_CONTRACT.variant === 'soul-regent', 'the candidate must remain one Lich Soul Regent');
check(EN_E05_LICH_CONTRACT.chassis === 'crowned-reliquary-undead', 'the Lich must retain its crowned reliquary chassis');
check(EN_E05_LICH_GATE.scope.includes('complete 80-frame Lich Soul Regent') && EN_E05_LICH_GATE.scope.includes('Cast-to-Attack') && EN_E05_LICH_GATE.scope.includes('Death-to-Hurt'), 'the gate must retain the full-suite and alias scope');
check(EN_E05_LICH_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E05_LICH_GATE.exclusions.includes('EN-E05 registration') && EN_E05_LICH_GATE.exclusions.includes('Wave 2'), 'the gate must protect fixtures and later expansion work');
check(Object.isFrozen(EN_E05_LICH_GATE) && Object.isFrozen(EN_E05_LICH_DATA), 'the Lich gate and renderer data must be deeply immutable');
check(EN_E05_LICH_DATA.actor.weapon === 'none' && EN_E05_LICH_DATA.actor.shield === 'none' && EN_E05_LICH_DATA.bakedEffects.length === 0, 'the custom Lich must remain shared-equipment-free, shieldless, and effect-free');

check(EN_E05_LICH_REGISTRY.families.length === 1, 'the candidate registry must contain exactly one family');
check(EN_E05_LICH_REGISTRY.families[0].id === 'lich', 'the candidate family id drifted');
check(EN_E05_LICH_REGISTRY.families[0].state === 'implemented', 'the candidate family must remain internal and implemented');
check(EN_E05_LICH_REGISTRY.publicFamilies.length === 0, 'the unapproved Lich candidate must have zero public families');
check(EN_E05_LICH_FAMILY.variants.length === 1 && EN_E05_LICH_FAMILY.variants[0].id === 'soul-regent', 'the candidate lane must contain only Soul Regent');

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 80 && publicVariantCount === 259, 'the source gate must retain the 57/202 legacy and current 80/259 public catalog boundaries');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'lich'), 'the later EN-E05 consumer gate must expose the registered Lich family');
check(engine.isPublicEnemyExpansionSpec(candidateSpec), 'the later EN-E05 consumer gate must route Lich through the public expansion dispatcher');
check(EN_E05_REVENANT_GATE.candidateFrameDigest === EN_E05_LICH_GATE.precedingApproval.candidateFrameDigest, 'the preceding Revenant approval digest must remain exact');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e05-lich') && !facadeSource.includes('enemy-expansion-en-e05-lich'), 'the Lich module must remain outside public engine imports');
check(await sha256File('asset-pack/enemies/zombie-ghoul.png') === 'a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2', 'the frozen legacy Ghoul fixture changed');

for (const variant of ['shambler', 'ghoul', 'rotter', 'brute']) {
  const frames = [];
  for (const direction of directions) for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
    frames.push(capturePixels((context) => drawLegacySprite(context, { kind: 'enemy', family: 'zombie', variant }, direction, animation.id, frame, { shadow: false })));
  }
  check(hashJson(frames) === expectedZombieDigests[variant], `raw legacy zombie/${variant} pixels changed during the isolated Lich candidate`);
}

const captures = new Map();
const revenantCaptures = new Map();
const candidateRecords = [];
const revenantRecords = [];
let candidateRevenantDifferences = 0;
let candidateRevenantAlphaDifferences = 0;
let completeBAddedPixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;
let connectedFrames = 0;
let boundedFrames = 0;
let coloredIdentityFrames = 0;
let frontEyeFrames = 0;
let sideEyeFrames = 0;
let rearEyeFrames = 0;

const lichColors = EN_E05_LICH_DATA.lich;
const boneColors = new Set(lichColors.bone);
const robeColors = new Set(lichColors.robe);
const liningColors = new Set(lichColors.lining);
const goldColors = new Set(lichColors.gold);
const staffColors = new Set(lichColors.staff);
const gemColors = new Set(lichColors.gem);
const cavityColors = new Set([lichColors.cavity]);

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const captured = captureEnemyExpansionFrame(EN_E05_LICH_REGISTRY, candidateSpec, direction, animation.id, frame);
  const revenant = captureEnemyExpansionFrame(EN_E05_REVENANT_REGISTRY, revenantSpec, direction, animation.id, frame);
  captures.set(key, captured);
  revenantCaptures.set(key, revenant);
  candidateRecords.push(candidateFrameRecord(captured, direction, animation.id, frame));
  revenantRecords.push(revenantFrameRecord(revenant, direction, animation.id, frame));

  check(captured.outOfBoundsWrites.length === 0, `${key} wrote outside the 24x24 cell`);
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, `${key} must preserve a one-cell margin`);
  if (captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22) boundedFrames++;
  check(captured.opaquePixels >= 210 && captured.opaquePixels <= 300, `${key} has implausible Lich density ${captured.opaquePixels}`);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  const components = componentCount(captured.pixels);
  check(components === 1, `${key} must remain one connected silhouette, found ${components}`);
  if (components === 1) connectedFrames++;

  if (JSON.stringify(captured.pixels) !== JSON.stringify(revenant.pixels)) candidateRevenantDifferences++;
  else check(false, `${key} must remain visually distinct from approved Revenant`);
  if (captured.alphaDigest !== revenant.alphaDigest) candidateRevenantAlphaDifferences++;

  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E05_LICH_DATA);
  const additions = presentation.formComplete.reduce((sum, color, index) => sum + (color && !captured.pixels[index] ? 1 : 0), 0);
  const formChanges = presentation.form.reduce((sum, color, index) => sum + (captured.pixels[index] && color !== captured.pixels[index] ? 1 : 0), 0);
  check(additions > 0, `${key} must receive Complete B outline pixels`);
  completeBAddedPixels += additions;
  formChangedPixels += formChanges;

  if (!isWhiteFlash(animation.id, frame)) {
    check(countColors(captured.pixels, boneColors) >= 10, `${key} must retain visible cold-bone anatomy`);
    check(countColors(captured.pixels, robeColors) >= 75, `${key} must retain substantial violet reliquary robes`);
    check(countColors(captured.pixels, liningColors) >= 25, `${key} must retain the teal reliquary lining`);
    check(countColors(captured.pixels, goldColors) >= 24, `${key} must retain the oxidized crown and staff fittings`);
    check(countColors(captured.pixels, staffColors) >= 8, `${key} must retain the connected ritual staff`);
    check(countColors(captured.pixels, gemColors) >= 4, `${key} must retain the sea-green soul gem`);
    const eyes = captured.pixels.filter((color) => color === lichColors.eye).length;
    if (direction === 'down') {
      check(eyes === 2, `${key} must show two mint oathfire front eyes`);
      check(countColors(captured.pixels, cavityColors) >= 2, `${key} must retain the dark front skull cavity`);
      if (eyes === 2) frontEyeFrames++;
    }
    if (direction === 'left' || direction === 'right') {
      check(eyes === 1, `${key} must show one mint oathfire profile eye`);
      check(countColors(captured.pixels, cavityColors) >= 2, `${key} must retain the dark profile skull cavity`);
      if (eyes === 1) sideEyeFrames++;
    }
    if (direction === 'up') {
      check(eyes === 0, `${key} must remain eye-free from the rear`);
      if (eyes === 0) rearEyeFrames++;
    }
    coloredIdentityFrames++;
  }
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get(frameKey('left', animation.id, frame));
  const right = captures.get(frameKey('right', animation.id, frame));
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), `left/right mirror drifted for ${animation.id} frame ${frame + 1}`);
}

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame++) {
    check(
      JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels),
      `${direction} Cast C${frame + 1} must alias Attack A${frame + 1}`,
    );
    const sourceFrame = EN_E05_LICH_DEATH_SOURCE_FRAMES[frame];
    check(
      JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'hurt', sourceFrame)).pixels),
      `${direction} Death D${frame + 1} must alias Hurt H${sourceFrame + 1}`,
    );
  }
  check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2, `${direction} Idle must contain two distinct frames`);
  check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4, `${direction} Walk must contain four distinct frames`);
  check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4, `${direction} Attack must contain four distinct frames`);
  check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'hurt', frame)).digest)).size === 2, `${direction} Hurt must contain two distinct frames`);
}

const candidateFrameDigest = hashJson(candidateRecords);
const revenantFrameDigest = hashJson(revenantRecords);
check(candidateRecords.length === 80 && revenantRecords.length === 80, 'the focused gate must exhaust 80 Lich and 80 approved Revenant frames');
check(candidateFrameDigest === EN_E05_LICH_GATE.candidateFrameDigest, 'the frozen 80-frame Lich digest drifted');
check(revenantFrameDigest === EN_E05_LICH_GATE.revenantComparisonDigest, 'the frozen approved-Revenant comparison digest drifted');
check(revenantFrameDigest === EN_E05_REVENANT_GATE.candidateFrameDigest, 'the Lich lane must preserve the exact approved Revenant digest');
check(candidateRevenantDifferences === 80, 'all 80 Lich frames must differ from the approved Revenant');
check(candidateRevenantAlphaDifferences === 80, 'all 80 Lich alpha silhouettes must differ from the approved Revenant');
check(connectedFrames === 80 && boundedFrames === 80, 'all 80 frames must remain connected and bounded');
check(coloredIdentityFrames === 72, 'the suite must contain 72 colored non-flash identity frames');
check(frontEyeFrames === 18, 'all 18 colored front frames must retain two eyes');
check(sideEyeFrames === 36, 'all 36 colored side frames must retain one profile eye');
check(rearEyeFrames === 18, 'all 18 colored rear frames must remain eye-free');
check(completeBAddedPixels > 0 && formChangedPixels > 0, 'the full suite must support Complete B and Form presentation');

const artifactEntries = [
  [EN_E05_LICH_GATE.artifact, EN_E05_LICH_GATE.artifactSha256],
  [EN_E05_LICH_GATE.assembledArtifact, EN_E05_LICH_GATE.assembledArtifactSha256],
  [EN_E05_LICH_GATE.comparisonArtifact, EN_E05_LICH_GATE.comparisonArtifactSha256],
  [EN_E05_LICH_GATE.reviewAnimations.raw.artifact, EN_E05_LICH_GATE.reviewAnimations.raw.sha256],
  [EN_E05_LICH_GATE.reviewAnimations.completeBForm.artifact, EN_E05_LICH_GATE.reviewAnimations.completeBForm.sha256],
];
let verifiedArtifacts = 0;
for (const [artifact, expectedHash] of artifactEntries) {
  try {
    check(await sha256File(artifact) === expectedHash, `${artifact} drifted from its frozen hash`);
    verifiedArtifacts++;
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

if (errors.length) {
  console.error('EN-E05 Lich Soul Regent focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E05 Lich Soul Regent focused gate passed.');
console.log('- Exact scope: one internal Lich/Soul Regent / 80 frames / 4 directions / 6 animation rows');
console.log(`- Distinction: ${candidateRevenantDifferences}/80 pixel frames and ${candidateRevenantAlphaDifferences}/80 alpha silhouettes differ from approved Revenant`);
console.log(`- Structure: ${connectedFrames}/80 connected; ${boundedFrames}/80 one-cell margins; opaque range ${minOpaquePixels}-${maxOpaquePixels}`);
console.log(`- Identity: ${coloredIdentityFrames}/72 colored frames; ${frontEyeFrames}/18 front-eye frames; ${sideEyeFrames}/36 side-eye frames; ${rearEyeFrames}/18 eye-free rear frames`);
console.log('- Motion: 2 Idle, 4 Walk, 4 Attack, 2 Hurt frames distinct per direction; Cast/Death aliases exact');
console.log(`- Presentation: Complete B +${completeBAddedPixels} outline pixels; Form changes ${formChangedPixels} source pixels`);
console.log('- Protected boundaries: approved Revenant exact; public catalog 80/259; Zombie siblings and legacy Ghoul fixture unchanged');
console.log(`- Review artifacts: ${verifiedArtifacts}/5 present and hash-verified`);
console.log(`- Candidate digest: ${candidateFrameDigest}`);
console.log(`- Approved Revenant digest: ${revenantFrameDigest}`);
