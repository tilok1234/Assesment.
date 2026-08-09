import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { capturePixels, renderSpritePixels } from '../engine/pixel-buffer.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E05_MUMMY_GATE,
  EN_E05_MUMMY_REGISTRY,
} from '../engine/enemy-expansion-en-e05-mummy.js';
import {
  EN_E05_VAMPIRE_CONTRACT,
  EN_E05_VAMPIRE_DATA,
  EN_E05_VAMPIRE_DEATH_SOURCE_FRAMES,
  EN_E05_VAMPIRE_FAMILY,
  EN_E05_VAMPIRE_GATE,
  EN_E05_VAMPIRE_REGISTRY,
} from '../engine/enemy-expansion-en-e05-vampire.js';
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
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'vampire', variant: 'night-noble' });
const mummySpec = Object.freeze({ kind: 'enemy', family: 'mummy', variant: 'tomb-walker' });
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
    family: 'vampire',
    variant: 'night-noble',
    candidateFamily: 'vampire',
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

function mummyFrameRecord(captured, direction, animation, frame) {
  return {
    family: 'mummy',
    variant: 'tomb-walker',
    candidateFamily: 'mummy',
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

check(EN_E05_VAMPIRE_GATE.id === 'en-e05-vampire-night-noble-full-v1', 'the Vampire Night Noble gate id drifted');
check(EN_E05_VAMPIRE_GATE.status === 'acceptance-candidate', 'the Vampire must remain an unapproved acceptance candidate');
check(EN_E05_VAMPIRE_GATE.authorizedOn === '2026-08-09', 'the Vampire authorization date drifted');
check(EN_E05_VAMPIRE_GATE.authorizationEvidence.includes('the designer replied: lets do nextg'), 'the gate must retain the exact designer continuation evidence');
check(EN_E05_VAMPIRE_GATE.authorizationEvidence.includes('one separate complete Vampire candidate'), 'the gate must retain the bounded Vampire authorization');
check(EN_E05_VAMPIRE_GATE.precedingApproval.gateId === EN_E05_MUMMY_GATE.id, 'the approved Mummy must remain the preceding gate');
check(EN_E05_VAMPIRE_GATE.precedingApproval.publishedImplementation === '85f1ed77b34d7aa300e6ef7454b85f5295ad1da1', 'the published Mummy implementation checkpoint drifted');
check(EN_E05_VAMPIRE_GATE.precedingApproval.publishedHandoff === '3387bf2fd465e6e861450ba6e69ed2de31fd45ad', 'the reconciled Mummy handoff checkpoint drifted');
check(EN_E05_VAMPIRE_CONTRACT.family === 'vampire' && EN_E05_VAMPIRE_CONTRACT.variant === 'night-noble', 'the candidate must remain one Vampire Night Noble');
check(EN_E05_VAMPIRE_CONTRACT.chassis === 'high-collared-night-undead', 'the Vampire must retain its high-collared night-undead chassis');
check(EN_E05_VAMPIRE_GATE.scope.includes('complete 80-frame Vampire Night Noble') && EN_E05_VAMPIRE_GATE.scope.includes('Cast-to-Attack') && EN_E05_VAMPIRE_GATE.scope.includes('Death-to-Hurt'), 'the gate must retain the full-suite and alias scope');
check(EN_E05_VAMPIRE_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E05_VAMPIRE_GATE.exclusions.includes('Revenant'), 'the gate must protect fixtures and later EN-E05 work');
check(Object.isFrozen(EN_E05_VAMPIRE_GATE) && Object.isFrozen(EN_E05_VAMPIRE_DATA), 'the Vampire gate and renderer data must be deeply immutable');
check(EN_E05_VAMPIRE_DATA.actor.weapon === 'none' && EN_E05_VAMPIRE_DATA.actor.shield === 'none' && EN_E05_VAMPIRE_DATA.bakedEffects.length === 0, 'the Vampire must remain weaponless, shieldless, and effect-free');

check(EN_E05_VAMPIRE_REGISTRY.families.length === 1, 'the candidate registry must contain exactly one family');
check(EN_E05_VAMPIRE_REGISTRY.families[0].id === 'vampire', 'the candidate family id drifted');
check(EN_E05_VAMPIRE_REGISTRY.families[0].state === 'implemented', 'the candidate family must remain internal and implemented');
check(EN_E05_VAMPIRE_REGISTRY.publicFamilies.length === 0, 'the unapproved Vampire candidate must have zero public families');
check(EN_E05_VAMPIRE_FAMILY.variants.length === 1 && EN_E05_VAMPIRE_FAMILY.variants[0].id === 'night-noble', 'the candidate lane must contain only Night Noble');

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 80 && publicVariantCount === 259, 'the source gate must retain the 57/202 legacy and current 80/259 public catalog boundaries');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'vampire'), 'the later EN-E05 consumer gate must expose the registered Vampire family');
check(engine.isPublicEnemyExpansionSpec(candidateSpec), 'the later EN-E05 consumer gate must route Vampire through the public expansion dispatcher');
check(EN_E05_MUMMY_GATE.status === 'approved', 'the preceding Mummy approval must remain exact');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e05-vampire') && !facadeSource.includes('enemy-expansion-en-e05-vampire'), 'the Vampire module must remain outside public engine imports');
check(await sha256File('asset-pack/enemies/zombie-ghoul.png') === 'a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2', 'the frozen legacy Ghoul fixture changed');

for (const variant of ['shambler', 'ghoul', 'rotter', 'brute']) {
  const frames = [];
  for (const direction of directions) for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
    frames.push(capturePixels((context) => drawLegacySprite(context, { kind: 'enemy', family: 'zombie', variant }, direction, animation.id, frame, { shadow: false })));
  }
  check(hashJson(frames) === expectedZombieDigests[variant], `raw legacy zombie/${variant} pixels changed during the isolated Vampire candidate`);
}

const captures = new Map();
const mummyCaptures = new Map();
const candidateRecords = [];
const mummyRecords = [];
let candidateMummyDifferences = 0;
let candidateMummyAlphaDifferences = 0;
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

const vampireColors = EN_E05_VAMPIRE_DATA.vampire;
const coatColors = new Set([...vampireColors.coat, ...vampireColors.hair]);
const crimsonColors = new Set(vampireColors.crimson);
const skinColors = new Set(vampireColors.skin);
const shirtColors = new Set(vampireColors.shirt);
const goldColors = new Set(vampireColors.gold);
const cavityColors = new Set([vampireColors.cavity]);

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const captured = captureEnemyExpansionFrame(EN_E05_VAMPIRE_REGISTRY, candidateSpec, direction, animation.id, frame);
  const mummy = captureEnemyExpansionFrame(EN_E05_MUMMY_REGISTRY, mummySpec, direction, animation.id, frame);
  captures.set(key, captured);
  mummyCaptures.set(key, mummy);
  candidateRecords.push(candidateFrameRecord(captured, direction, animation.id, frame));
  mummyRecords.push(mummyFrameRecord(mummy, direction, animation.id, frame));

  check(captured.outOfBoundsWrites.length === 0, `${key} wrote outside the 24x24 cell`);
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, `${key} must preserve a one-cell margin`);
  if (captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22) boundedFrames++;
  check(captured.opaquePixels >= 150 && captured.opaquePixels <= 280, `${key} has implausible Vampire density ${captured.opaquePixels}`);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  const components = componentCount(captured.pixels);
  check(components === 1, `${key} must remain one connected silhouette, found ${components}`);
  if (components === 1) connectedFrames++;

  if (JSON.stringify(captured.pixels) !== JSON.stringify(mummy.pixels)) candidateMummyDifferences++;
  else check(false, `${key} must remain visually distinct from approved Mummy`);
  if (captured.alphaDigest !== mummy.alphaDigest) candidateMummyAlphaDifferences++;

  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E05_VAMPIRE_DATA);
  const additions = presentation.formComplete.reduce((sum, color, index) => sum + (color && !captured.pixels[index] ? 1 : 0), 0);
  const formChanges = presentation.form.reduce((sum, color, index) => sum + (captured.pixels[index] && color !== captured.pixels[index] ? 1 : 0), 0);
  check(additions > 0, `${key} must receive Complete B outline pixels`);
  completeBAddedPixels += additions;
  formChangedPixels += formChanges;

  if (!isWhiteFlash(animation.id, frame)) {
    check(countColors(captured.pixels, coatColors) >= 65, `${key} must retain a substantial black-violet coat and cape`);
    check(countColors(captured.pixels, crimsonColors) >= 18, `${key} must retain the crimson collar and lining`);
    check(countColors(captured.pixels, skinColors) >= 18, `${key} must retain visible pallid undead anatomy`);
    check(countColors(captured.pixels, goldColors) >= 1, `${key} must retain the antique-gold clasp`);
    if (direction !== 'up') check(countColors(captured.pixels, shirtColors) >= 6, `${key} must retain the ivory formal shirt or cuffs`);
    const eyes = captured.pixels.filter((color) => color === vampireColors.eye).length;
    if (direction === 'down') {
      check(eyes === 2, `${key} must show two ember-red front eyes`);
      check(countColors(captured.pixels, cavityColors) >= 2, `${key} must retain the dark front mouth cavity`);
      if (eyes === 2) frontEyeFrames++;
    }
    if (direction === 'left' || direction === 'right') {
      check(eyes === 1, `${key} must show one ember-red profile eye`);
      check(countColors(captured.pixels, cavityColors) >= 2, `${key} must retain the dark profile mouth cavity`);
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
    const sourceFrame = EN_E05_VAMPIRE_DEATH_SOURCE_FRAMES[frame];
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
const mummyFrameDigest = hashJson(mummyRecords);
check(candidateRecords.length === 80 && mummyRecords.length === 80, 'the focused gate must exhaust 80 Vampire and 80 approved Mummy frames');
check(candidateFrameDigest === EN_E05_VAMPIRE_GATE.candidateFrameDigest, 'the frozen 80-frame Vampire digest drifted');
check(mummyFrameDigest === EN_E05_VAMPIRE_GATE.mummyComparisonDigest, 'the frozen approved-Mummy comparison digest drifted');
check(mummyFrameDigest === EN_E05_MUMMY_GATE.candidateFrameDigest, 'the Vampire lane must preserve the exact approved Mummy digest');
check(candidateMummyDifferences === 80, 'all 80 Vampire frames must differ from the approved Mummy');
check(candidateMummyAlphaDifferences === 80, 'all 80 Vampire alpha silhouettes must differ from the approved Mummy');
check(connectedFrames === 80 && boundedFrames === 80, 'all 80 frames must remain connected and bounded');
check(coloredIdentityFrames === 72, 'the suite must contain 72 colored non-flash identity frames');
check(frontEyeFrames === 18, 'all 18 colored front frames must retain two eyes');
check(sideEyeFrames === 36, 'all 36 colored side frames must retain one profile eye');
check(rearEyeFrames === 18, 'all 18 colored rear frames must remain eye-free');
check(completeBAddedPixels > 0 && formChangedPixels > 0, 'the full suite must support Complete B and Form presentation');

const artifactEntries = [
  [EN_E05_VAMPIRE_GATE.artifact, EN_E05_VAMPIRE_GATE.artifactSha256],
  [EN_E05_VAMPIRE_GATE.assembledArtifact, EN_E05_VAMPIRE_GATE.assembledArtifactSha256],
  [EN_E05_VAMPIRE_GATE.comparisonArtifact, EN_E05_VAMPIRE_GATE.comparisonArtifactSha256],
  [EN_E05_VAMPIRE_GATE.reviewAnimations.raw.artifact, EN_E05_VAMPIRE_GATE.reviewAnimations.raw.sha256],
  [EN_E05_VAMPIRE_GATE.reviewAnimations.completeBForm.artifact, EN_E05_VAMPIRE_GATE.reviewAnimations.completeBForm.sha256],
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
  console.error('EN-E05 Vampire Night Noble focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E05 Vampire Night Noble focused gate passed.');
console.log('- Exact scope: one internal Vampire/Night Noble / 80 frames / 4 directions / 6 animation rows');
console.log(`- Distinction: ${candidateMummyDifferences}/80 pixel frames and ${candidateMummyAlphaDifferences}/80 alpha silhouettes differ from approved Mummy`);
console.log(`- Structure: ${connectedFrames}/80 connected; ${boundedFrames}/80 one-cell margins; opaque range ${minOpaquePixels}-${maxOpaquePixels}`);
console.log(`- Identity: ${coloredIdentityFrames}/72 colored frames; ${frontEyeFrames}/18 front-eye frames; ${sideEyeFrames}/36 side-eye frames; ${rearEyeFrames}/18 eye-free rear frames`);
console.log('- Motion: 2 Idle, 4 Walk, 4 Attack, 2 Hurt frames distinct per direction; Cast/Death aliases exact');
console.log(`- Presentation: Complete B +${completeBAddedPixels} outline pixels; Form changes ${formChangedPixels} source pixels`);
console.log('- Protected boundaries: approved Mummy exact; public catalog 80/259; Zombie siblings and legacy Ghoul fixture unchanged');
console.log(`- Review artifacts: ${verifiedArtifacts}/5 present and hash-verified`);
console.log(`- Candidate digest: ${candidateFrameDigest}`);
console.log(`- Approved Mummy digest: ${mummyFrameDigest}`);
