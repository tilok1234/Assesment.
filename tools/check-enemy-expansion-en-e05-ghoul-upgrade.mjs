import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { renderSpritePixels } from '../engine/pixel-buffer.js';
import {
  EN_E05_GHOUL_DEATH_SOURCE_FRAMES,
  EN_E05_GHOUL_UPGRADE_CONTRACT,
  EN_E05_GHOUL_UPGRADE_DATA,
  EN_E05_GHOUL_UPGRADE_FAMILY,
  EN_E05_GHOUL_UPGRADE_GATE,
  EN_E05_GHOUL_UPGRADE_REGISTRY,
} from '../engine/enemy-expansion-en-e05-ghoul-upgrade.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  alphaDigest,
  mirrorPixels,
  pixelDigest,
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
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'ghoul-upgrade', variant: 'ghoul' });
const legacySpec = Object.freeze({ kind: 'enemy', family: 'zombie', variant: 'ghoul' });
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
    family: 'zombie',
    variant: 'ghoul',
    candidateFamily: 'ghoul-upgrade',
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

function legacyFrameRecord(pixels, direction, animation, frame) {
  return {
    family: 'zombie',
    variant: 'ghoul',
    direction,
    animation,
    frame,
    digest: pixelDigest(pixels),
    alphaDigest: alphaDigest(pixels),
  };
}

function frameKey(direction, animation, frame) {
  return `${direction}/${animation}/${frame}`;
}

function isWhiteFlash(animation, frame) {
  return (animation === 'hurt' && frame === 0) || (animation === 'death' && frame === 0);
}

check(EN_E05_GHOUL_UPGRADE_GATE.id === 'en-e05-ghoul-upgrade-full-v1', 'the Ghoul upgrade gate id drifted');
check(EN_E05_GHOUL_UPGRADE_GATE.status === 'approved', 'the Ghoul upgrade must retain exact designer approval');
check(EN_E05_GHOUL_UPGRADE_GATE.authorizedOn === '2026-08-09', 'the Ghoul authorization date drifted');
check(EN_E05_GHOUL_UPGRADE_GATE.authorizationEvidence.includes('one full sprite with all animations each run'), 'the gate must retain the designer-authorized full-sprite cadence');
check(EN_E05_GHOUL_UPGRADE_GATE.approvedOn === '2026-08-09', 'the Ghoul approval date drifted');
check(EN_E05_GHOUL_UPGRADE_GATE.approvalEvidence.includes('the designer said: approved'), 'the gate must retain exact designer approval evidence');
check(EN_E05_GHOUL_UPGRADE_GATE.approvalEvidence.includes('public zombie/ghoul replacement and fixture regeneration remain separate gates'), 'the approval must not silently authorize public replacement or fixture regeneration');
check(EN_E05_GHOUL_UPGRADE_GATE.precedingApproval.gateId === 'en-e04-assembler-consumers-v1', 'the completed EN-E04 assembler integration must remain the preceding gate');
check(EN_E05_GHOUL_UPGRADE_CONTRACT.replacementTarget.family === 'zombie' && EN_E05_GHOUL_UPGRADE_CONTRACT.replacementTarget.variant === 'ghoul', 'the candidate must target existing zombie/ghoul');
check(EN_E05_GHOUL_UPGRADE_CONTRACT.chassis === 'feral-hunched-undead', 'the Ghoul must retain its feral undead chassis');
check(EN_E05_GHOUL_UPGRADE_GATE.scope.includes('complete 80-frame Ghoul upgrade') && EN_E05_GHOUL_UPGRADE_GATE.scope.includes('Cast-to-Attack') && EN_E05_GHOUL_UPGRADE_GATE.scope.includes('Death-to-Hurt'), 'the gate must retain the full-suite and alias scope');
check(EN_E05_GHOUL_UPGRADE_GATE.exclusions.includes('asset-pack fixture regeneration') && EN_E05_GHOUL_UPGRADE_GATE.exclusions.includes('changes to zombie/rotter'), 'the gate must protect legacy fixtures and Zombie siblings');
check(Object.isFrozen(EN_E05_GHOUL_UPGRADE_GATE) && Object.isFrozen(EN_E05_GHOUL_UPGRADE_DATA), 'the Ghoul gate and renderer data must be deeply immutable');
check(EN_E05_GHOUL_UPGRADE_DATA.actor.weapon === 'none' && EN_E05_GHOUL_UPGRADE_DATA.actor.shield === 'none' && EN_E05_GHOUL_UPGRADE_DATA.bakedEffects.length === 0, 'the Ghoul must remain weaponless, shieldless, and effect-free');

check(EN_E05_GHOUL_UPGRADE_REGISTRY.families.length === 1, 'the candidate registry must contain exactly one family');
check(EN_E05_GHOUL_UPGRADE_REGISTRY.families[0].id === 'ghoul-upgrade', 'the candidate family id drifted');
check(EN_E05_GHOUL_UPGRADE_REGISTRY.families[0].state === 'implemented', 'the candidate family must remain internal and implemented');
check(EN_E05_GHOUL_UPGRADE_REGISTRY.publicFamilies.length === 0, 'the approved internal Ghoul lane must have zero public families');
check(EN_E05_GHOUL_UPGRADE_FAMILY.variants.length === 1 && EN_E05_GHOUL_UPGRADE_FAMILY.variants[0].id === 'ghoul', 'the candidate lane must contain only the Ghoul replacement');

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 70 && publicVariantCount === 241, 'the candidate must not change the 57-family legacy or 70/241 public catalog boundaries');
const zombieFamily = engine.ENEMIES.find((family) => family.id === 'zombie');
check(Boolean(zombieFamily), 'the legacy Zombie family is missing');
check(JSON.stringify(zombieFamily?.variants.map((variant) => variant.id)) === JSON.stringify(['shambler', 'ghoul', 'rotter', 'brute']), 'the legacy Zombie variant order must remain unchanged');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'ghoul-upgrade'), 'the candidate review family must remain absent from public selectors');
check(!engine.isPublicEnemyExpansionSpec(candidateSpec), 'the candidate must not route through the public expansion dispatcher');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e05-ghoul-upgrade') && !facadeSource.includes('enemy-expansion-en-e05-ghoul-upgrade'), 'the candidate module must remain outside public engine imports');
check(await sha256File('asset-pack/enemies/zombie-ghoul.png') === 'a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2', 'the frozen legacy Ghoul fixture changed');

const siblingPixelFrames = new Map();
for (const variant of ['shambler', 'ghoul', 'rotter', 'brute']) {
  const frames = [];
  for (const direction of directions) for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
    frames.push(renderSpritePixels({ kind: 'enemy', family: 'zombie', variant }, direction, animation.id, frame, { shadow: false }));
  }
  siblingPixelFrames.set(variant, frames);
  check(hashJson(frames) === expectedZombieDigests[variant], `public zombie/${variant} pixels changed during the isolated Ghoul candidate`);
}

const captures = new Map();
const legacyCaptures = new Map();
const candidateRecords = [];
const legacyRecords = [];
let candidateLegacyDifferences = 0;
let completeBAddedPixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;
let connectedFrames = 0;
let boundedFrames = 0;
let coloredIdentityFrames = 0;
let sideEyeFrames = 0;
let rearEyeFrames = 0;

const ghoulColors = EN_E05_GHOUL_UPGRADE_DATA.ghoul;
const fleshColors = new Set([...ghoulColors.flesh, ghoulColors.rot]);
const boneColors = new Set(ghoulColors.bone);
const woundColors = new Set(ghoulColors.wound);
const ragColors = new Set([...ghoulColors.rag, ...ghoulColors.leather]);

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const captured = captureEnemyExpansionFrame(EN_E05_GHOUL_UPGRADE_REGISTRY, candidateSpec, direction, animation.id, frame);
  const legacy = renderSpritePixels(legacySpec, direction, animation.id, frame, { shadow: false });
  captures.set(key, captured);
  legacyCaptures.set(key, legacy);
  candidateRecords.push(candidateFrameRecord(captured, direction, animation.id, frame));
  legacyRecords.push(legacyFrameRecord(legacy, direction, animation.id, frame));

  check(captured.outOfBoundsWrites.length === 0, `${key} wrote outside the 24x24 cell`);
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, `${key} must preserve a one-cell margin`);
  if (captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22) boundedFrames++;
  check(captured.opaquePixels >= 150 && captured.opaquePixels <= 230, `${key} has implausible Ghoul density ${captured.opaquePixels}`);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  check(componentCount(captured.pixels) === 1, `${key} must remain one connected silhouette`);
  if (componentCount(captured.pixels) === 1) connectedFrames++;

  if (JSON.stringify(captured.pixels) !== JSON.stringify(legacy)) candidateLegacyDifferences++;
  else check(false, `${key} did not change from the legacy Ghoul`);

  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E05_GHOUL_UPGRADE_DATA);
  const additions = presentation.formComplete.reduce((sum, color, index) => sum + (color && !captured.pixels[index] ? 1 : 0), 0);
  const formChanges = presentation.form.reduce((sum, color, index) => sum + (captured.pixels[index] && color !== captured.pixels[index] ? 1 : 0), 0);
  check(additions > 0, `${key} must receive Complete B outline pixels`);
  completeBAddedPixels += additions;
  formChangedPixels += formChanges;

  if (!isWhiteFlash(animation.id, frame)) {
    check(countColors(captured.pixels, fleshColors) >= 70, `${key} must retain substantial corpse flesh`);
    check(countColors(captured.pixels, boneColors) >= 4, `${key} must retain visible bone or claws`);
    check(countColors(captured.pixels, woundColors) >= 1, `${key} must retain a wound accent`);
    check(countColors(captured.pixels, ragColors) >= 10, `${key} must retain torn grave clothing`);
    const eyes = captured.pixels.filter((color) => color === ghoulColors.eye).length;
    if (direction === 'down') check(eyes === 2, `${key} must show two corpse-yellow front eyes`);
    if (direction === 'left' || direction === 'right') {
      check(eyes === 1, `${key} must show one profile eye`);
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
    const sourceFrame = EN_E05_GHOUL_DEATH_SOURCE_FRAMES[frame];
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
const legacyFrameDigest = hashJson(legacyRecords);
check(candidateRecords.length === 80 && legacyRecords.length === 80, 'the focused gate must exhaust 80 candidate and 80 legacy frames');
check(candidateFrameDigest === EN_E05_GHOUL_UPGRADE_GATE.candidateFrameDigest, 'the frozen 80-frame candidate digest drifted');
check(legacyFrameDigest === EN_E05_GHOUL_UPGRADE_GATE.legacyFrameDigest, 'the frozen 80-frame legacy comparison digest drifted');
check(candidateLegacyDifferences === 80, 'all 80 Ghoul candidate frames must differ from the existing legacy presentation');
check(connectedFrames === 80 && boundedFrames === 80, 'all 80 frames must remain connected and bounded');
check(coloredIdentityFrames === 72, 'the suite must contain 72 colored non-flash identity frames');
check(sideEyeFrames === 36, 'all 36 colored side frames must retain one profile eye');
check(rearEyeFrames === 18, 'all 18 colored rear frames must remain eye-free');
check(completeBAddedPixels > 0 && formChangedPixels > 0, 'the full suite must support Complete B and Form presentation');

const artifactEntries = [
  [EN_E05_GHOUL_UPGRADE_GATE.artifact, EN_E05_GHOUL_UPGRADE_GATE.artifactSha256],
  [EN_E05_GHOUL_UPGRADE_GATE.assembledArtifact, EN_E05_GHOUL_UPGRADE_GATE.assembledArtifactSha256],
  [EN_E05_GHOUL_UPGRADE_GATE.comparisonArtifact, EN_E05_GHOUL_UPGRADE_GATE.comparisonArtifactSha256],
  [EN_E05_GHOUL_UPGRADE_GATE.reviewAnimations.raw.artifact, EN_E05_GHOUL_UPGRADE_GATE.reviewAnimations.raw.sha256],
  [EN_E05_GHOUL_UPGRADE_GATE.reviewAnimations.completeBForm.artifact, EN_E05_GHOUL_UPGRADE_GATE.reviewAnimations.completeBForm.sha256],
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
  console.error('EN-E05 Ghoul upgrade focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E05 Ghoul upgrade focused gate passed.');
console.log('- Exact scope: existing zombie/ghoul replacement candidate / 80 frames / 4 directions / 6 animation rows');
console.log(`- Candidate vs legacy: ${candidateLegacyDifferences}/80 frames changed; public replacement remains unapplied`);
console.log(`- Structure: ${connectedFrames}/80 connected; ${boundedFrames}/80 one-cell margins; opaque range ${minOpaquePixels}-${maxOpaquePixels}`);
console.log(`- Identity: ${coloredIdentityFrames}/72 colored frames; ${sideEyeFrames}/36 side eyes; ${rearEyeFrames}/18 eye-free rear frames`);
console.log('- Motion: 2 Idle, 4 Walk, 4 Attack, 2 Hurt frames distinct per direction; Cast/Death aliases exact');
console.log(`- Presentation: Complete B +${completeBAddedPixels} outline pixels; Form changes ${formChangedPixels} source pixels`);
console.log(`- Protected Zombie baselines: shambler/ghoul/rotter/brute exact; legacy fixture SHA-256 unchanged`);
console.log(`- Review artifacts: ${verifiedArtifacts}/5 present and hash-verified`);
console.log(`- Candidate digest: ${candidateFrameDigest}`);
console.log(`- Legacy digest: ${legacyFrameDigest}`);
