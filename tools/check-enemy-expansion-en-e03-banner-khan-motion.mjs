import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E03_CENTAUR_WALK_GATE,
  EN_E03_CENTAUR_WALK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-walk.js';
import {
  EN_E03_CENTAUR_ATTACK_GATE,
  EN_E03_CENTAUR_ATTACK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-attack.js';
import {
  EN_E03_CENTAUR_HURT_GATE,
  EN_E03_CENTAUR_HURT_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-hurt.js';
import {
  EN_E03_BANNER_KHAN_IDLE_DATA,
  EN_E03_BANNER_KHAN_IDLE_GATE,
  EN_E03_BANNER_KHAN_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-elite-idle.js';
import {
  EN_E03_BANNER_KHAN_DEATH_SOURCE_FRAMES,
  EN_E03_BANNER_KHAN_MOTION_FAMILY,
  EN_E03_BANNER_KHAN_MOTION_GATE,
  EN_E03_BANNER_KHAN_MOTION_REGISTRY,
  EN_E03_BANNER_KHAN_MOTION_RENDERER,
} from '../engine/enemy-expansion-en-e03-centaur-elite-motion.js';
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

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.resolve(root, relativePath))).digest('hex');
}

function frameRecord(captured, variant, direction, animation, frame) {
  return {
    family: 'centaur',
    variant,
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

function recordsFor(registry, variant, animation, count) {
  const records = [];
  const spec = { kind: 'enemy', family: 'centaur', variant };
  for (const direction of engine.DIRS) for (let frame = 0; frame < count; frame++) {
    records.push(frameRecord(
      captureEnemyExpansionFrame(registry, spec, direction, animation, frame),
      variant,
      direction,
      animation,
      frame,
    ));
  }
  return records;
}

function digestRecords(records) {
  return createHash('sha256').update(JSON.stringify(records)).digest('hex');
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

function regionSignature(captured, minX, maxX, minY, maxY, alphaOnly = false) {
  const values = [];
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    const index = (y * engine.SIZE) + x;
    values.push(alphaOnly ? captured.alpha[index] : captured.pixels[index]);
  }
  return JSON.stringify(values);
}

function groundSignature(captured) {
  return regionSignature(captured, 0, engine.SIZE - 1, 20, 22, true);
}

function pixelsEqual(first, second) {
  return JSON.stringify(first.pixels) === JSON.stringify(second.pixels);
}

check(EN_E03_BANNER_KHAN_MOTION_GATE.status === 'approved', 'the grouped Banner Khan motion gate must retain exact visual approval');
check(EN_E03_BANNER_KHAN_MOTION_GATE.authorizedOn === '2026-08-07', 'the grouped motion gate must retain its authorization date');
check(EN_E03_BANNER_KHAN_MOTION_GATE.authorizationEvidence.includes('lets keep going') && EN_E03_BANNER_KHAN_MOTION_GATE.authorizationEvidence.includes('one larger follow-up review'), 'the gate must retain the exact continuation evidence and grouped-pass boundary');
check(EN_E03_BANNER_KHAN_MOTION_GATE.approvedOn === '2026-08-08', 'the grouped Banner Khan motion approval date must remain frozen');
check(EN_E03_BANNER_KHAN_MOTION_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Banner Khan motion-suite GIFs together and said: approved.', 'the grouped gate must retain the exact paired-GIF approval evidence');
check(EN_E03_BANNER_KHAN_MOTION_GATE.approvedIdle.gateId === EN_E03_BANNER_KHAN_IDLE_GATE.id, 'the grouped gate must identify the approved Banner Khan Idle baseline');
check(EN_E03_BANNER_KHAN_MOTION_GATE.approvedIdle.frameDigest === EN_E03_BANNER_KHAN_IDLE_GATE.candidateFrameDigest, 'the grouped gate must freeze the approved Banner Khan Idle digest');
check(EN_E03_BANNER_KHAN_MOTION_GATE.approvedIdle.publishedCheckpoint === '55143049b4153e34fcdaad0ea434932ba0f2d0fd', 'the grouped gate must retain the published Banner Khan Idle checkpoint');
check(EN_E03_BANNER_KHAN_MOTION_GATE.approvedMotionSources.walk.gateId === EN_E03_CENTAUR_WALK_GATE.id, 'the grouped gate must identify the approved Steppe Hunter Walk source');
check(EN_E03_BANNER_KHAN_MOTION_GATE.approvedMotionSources.attack.gateId === EN_E03_CENTAUR_ATTACK_GATE.id, 'the grouped gate must identify the approved Steppe Hunter Attack source');
check(EN_E03_BANNER_KHAN_MOTION_GATE.approvedMotionSources.hurt.gateId === EN_E03_CENTAUR_HURT_GATE.id, 'the grouped gate must identify the approved Steppe Hunter Hurt source');
check(EN_E03_BANNER_KHAN_MOTION_GATE.scope.includes('Walk W1-W4') && EN_E03_BANNER_KHAN_MOTION_GATE.scope.includes('Death D1-D4') && EN_E03_BANNER_KHAN_MOTION_GATE.scope.includes('Idle F1-F2 delegated byte-for-byte'), 'the grouped gate must state the exact complete motion scope and protected Idle context');
check(EN_E03_BANNER_KHAN_MOTION_GATE.animationContract.includes('Cast aliases the Banner Khan Attack frame-for-frame') && EN_E03_BANNER_KHAN_MOTION_GATE.animationContract.includes('Death aliases Banner Khan Hurt H1,H2,H2,H2'), 'the grouped gate must retain exact Cast and Death alias contracts');
check(EN_E03_BANNER_KHAN_MOTION_GATE.exclusions.includes('approved Banner Khan Idle pixel changes') && EN_E03_BANNER_KHAN_MOTION_GATE.exclusions.includes('new Cast pixels') && EN_E03_BANNER_KHAN_MOTION_GATE.exclusions.includes('new Death pixels') && EN_E03_BANNER_KHAN_MOTION_GATE.exclusions.includes('registration') && EN_E03_BANNER_KHAN_MOTION_GATE.exclusions.includes('release'), 'the grouped gate must exclude approved-pixel changes, new alias pixels, integration, and release');
check(EN_E03_BANNER_KHAN_MOTION_GATE.nextGate.includes('Visual approval and bounded publication are complete') && EN_E03_BANNER_KHAN_MOTION_GATE.nextGate.includes('No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized'), 'the approved grouped gate must stop before later work without a separate continuation');
check(Object.isFrozen(EN_E03_BANNER_KHAN_MOTION_GATE) && Object.isFrozen(EN_E03_BANNER_KHAN_MOTION_GATE.approvedMotionSources) && Object.isFrozen(EN_E03_BANNER_KHAN_MOTION_GATE.exclusions), 'the grouped gate must be deeply immutable');

check(EN_E03_BANNER_KHAN_MOTION_REGISTRY.families.length === 1, 'the grouped registry must contain exactly one family');
check(EN_E03_BANNER_KHAN_MOTION_FAMILY.variants.length === 1 && EN_E03_BANNER_KHAN_MOTION_FAMILY.variants[0].id === 'banner-khan', 'the grouped registry must contain only Banner Khan');
check(EN_E03_BANNER_KHAN_MOTION_REGISTRY.publicFamilies.length === 0 && EN_E03_BANNER_KHAN_MOTION_REGISTRY.approvedFamilies.length === 0, 'the grouped Banner Khan candidate must remain internal and non-public');
check(EN_E03_BANNER_KHAN_IDLE_DATA.bakedEffects.length === 0 && EN_E03_BANNER_KHAN_IDLE_DATA.effectBoundary === 'external-command-aura-banner-flare-and-hoof-shock-ring', 'all command, banner-flare, and hoof-shock effects must remain external');
check(engine.EN_E03_BANNER_KHAN_MOTION_REGISTRY === undefined && engine.EN_E03_BANNER_KHAN_MOTION_GATE === undefined, 'the grouped motion candidate must not leak through the public engine facade');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-centaur-elite-motion') && !facadeSource.includes('EN_E03_BANNER_KHAN_MOTION'), 'the public facade must not import or expose the grouped motion module');

const approvedWalkRecords = recordsFor(EN_E03_CENTAUR_WALK_REGISTRY, 'steppe-hunter', 'walk', 4);
const approvedAttackRecords = recordsFor(EN_E03_CENTAUR_ATTACK_REGISTRY, 'steppe-hunter', 'attack', 4);
const approvedHurtRecords = recordsFor(EN_E03_CENTAUR_HURT_REGISTRY, 'steppe-hunter', 'hurt', 2);
check(digestRecords(approvedWalkRecords) === EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest, 'the approved Steppe Hunter Walk source drifted while exposing its draw helper');
check(digestRecords(approvedAttackRecords) === EN_E03_CENTAUR_ATTACK_GATE.candidateFrameDigest, 'the approved Steppe Hunter Attack source drifted while exposing its draw helpers');
check(digestRecords(approvedHurtRecords) === EN_E03_CENTAUR_HURT_GATE.candidateFrameDigest, 'the approved Steppe Hunter Hurt source drifted while exposing its draw helpers');

const spec = Object.freeze({ kind: 'enemy', family: 'centaur', variant: 'banner-khan' });
const animations = Object.freeze([
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
]);
const suiteFrames = new Map();
const suiteRecords = [];
const bannerColors = new Set(EN_E03_BANNER_KHAN_IDLE_DATA.elite.banner);
const armorColors = new Set(EN_E03_BANNER_KHAN_IDLE_DATA.elite.armor);
const clothColors = new Set(EN_E03_BANNER_KHAN_IDLE_DATA.elite.cloth);
const furColors = new Set(EN_E03_BANNER_KHAN_IDLE_DATA.elite.fur);
let bannerPixels = 0;
let armorPixels = 0;
let clothPixels = 0;
let furPixels = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let connectedFrames = 0;
let hardAlphaFrames = 0;

for (const animation of animations) for (const direction of engine.DIRS) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E03_BANNER_KHAN_MOTION_REGISTRY,
    spec,
    direction,
    animation.id,
    frame,
  );
  suiteFrames.set([animation.id, direction, frame].join('/'), captured);
  suiteRecords.push(frameRecord(captured, 'banner-khan', direction, animation.id, frame));
  const label = direction + '/' + animation.id + '/' + (frame + 1);
  check(captured.outOfBoundsWrites.length === 0, label + ' must not write outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, label + ' must retain a one-cell margin');
  check(captured.alpha.every((value) => value === 0 || value === 255), label + ' must retain hard alpha');
  if (captured.alpha.every((value) => value === 0 || value === 255)) hardAlphaFrames++;
  check(componentCount(captured.pixels) === 1, label + ' must retain one connected rider-horse-lance-standard silhouette');
  if (componentCount(captured.pixels) === 1) connectedFrames++;
  check(captured.opaquePixels >= 175 && captured.opaquePixels <= 330, label + ' must retain bounded elite Centaur visual weight');
  check(captured.renderResult.bannerKhanMotionGate === EN_E03_BANNER_KHAN_MOTION_GATE.id, label + ' must report the grouped motion gate');
  check(captured.renderResult.approvedBannerKhanIdleGate === EN_E03_BANNER_KHAN_IDLE_GATE.id, label + ' must report the approved Banner Khan Idle gate');
  check(captured.renderResult.effectBoundary === EN_E03_BANNER_KHAN_IDLE_DATA.effectBoundary, label + ' must report the external effect boundary');
  const isWhiteFlash = (animation.id === 'hurt' && frame === 0) || (animation.id === 'death' && frame === 0);
  if (isWhiteFlash) {
    check(captured.pixels.every((color) => color === null || color === '#ffffff'), label + ' must flash the complete connected elite silhouette white');
  } else {
    const frameBannerPixels = captured.pixels.filter((color) => bannerColors.has(color)).length;
    const frameArmorPixels = captured.pixels.filter((color) => armorColors.has(color)).length;
    const frameClothPixels = captured.pixels.filter((color) => clothColors.has(color)).length;
    const frameFurPixels = captured.pixels.filter((color) => furColors.has(color)).length;
    check(frameBannerPixels >= 7, label + ' must retain the readable tapered crimson standard');
    check(frameArmorPixels >= 23, label + ' must retain the segmented lamellar identity');
    check(frameClothPixels >= 10, label + ' must retain the controlled crimson cloth identity');
    check(frameFurPixels >= 4, label + ' must retain the compact two-tone collar');
    bannerPixels += frameBannerPixels;
    armorPixels += frameArmorPixels;
    clothPixels += frameClothPixels;
    furPixels += frameFurPixels;
  }
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_BANNER_KHAN_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const delegated = suiteFrames.get(['idle', direction, frame].join('/'));
  const approved = captureEnemyExpansionFrame(EN_E03_BANNER_KHAN_IDLE_REGISTRY, spec, direction, 'idle', frame);
  check(pixelsEqual(delegated, approved) && delegated.digest === approved.digest, direction + '/Idle F' + (frame + 1) + ' must delegate the exact approved Banner Khan Idle pixels');
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = suiteFrames.get([animation.id, 'left', frame].join('/'));
  const right = suiteFrames.get([animation.id, 'right', frame].join('/'));
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE)), animation.id + '/' + (frame + 1) + ' Left must be the exact mirror of Right');
  const down = suiteFrames.get([animation.id, 'down', frame].join('/'));
  const up = suiteFrames.get([animation.id, 'up', frame].join('/'));
  check(down.alphaDigest !== up.alphaDigest, animation.id + '/' + (frame + 1) + ' Down and Up must retain distinct depth silhouettes');
}

for (const direction of engine.DIRS) {
  const walk = [0, 1, 2, 3].map((frame) => suiteFrames.get(['walk', direction, frame].join('/')));
  check(walk[0].alphaDigest !== walk[1].alphaDigest && walk[2].alphaDigest !== walk[1].alphaDigest, direction + ' Walk weight poses must differ from the passing pose');
  check(walk[0].alphaDigest !== walk[2].alphaDigest, direction + ' Walk W1/W3 must retain opposite diagonal hoof silhouettes');
  check(walk[1].digest === walk[3].digest, direction + ' Walk W2/W4 must retain the deliberate shared passing pose');
  check(new Set(walk.map(groundSignature)).size === 3, direction + ' Walk must retain three hoof-contact cycles with only W2/W4 shared');
  check(regionSignature(walk[0], 5, 19, 12, 17) !== regionSignature(walk[1], 5, 19, 12, 17), direction + ' Walk must visibly move the horse torso as well as the legs');

  const attack = [0, 1, 2, 3].map((frame) => suiteFrames.get(['attack', direction, frame].join('/')));
  check(new Set(attack.map((captured) => captured.digest)).size === 4, direction + ' Attack must retain four distinct elite spear phases');
  check(new Set(attack.map((captured) => regionSignature(captured, 3, 20, 12, 18))).size >= 3, direction + ' Attack must move the horse-and-rider body through at least three phases');

  const hurt = [0, 1].map((frame) => suiteFrames.get(['hurt', direction, frame].join('/')));
  check(hurt[0].alphaDigest !== hurt[1].alphaDigest, direction + ' Hurt must use two distinct full-hybrid silhouettes');
  check(groundSignature(hurt[0]) === groundSignature(hurt[1]), direction + ' Hurt must retain fixed planted hoof anchors across H1-H2');

  for (let frame = 0; frame < 4; frame++) {
    const cast = suiteFrames.get(['cast', direction, frame].join('/'));
    check(pixelsEqual(cast, attack[frame]), direction + '/Cast C' + (frame + 1) + ' must alias Banner Khan Attack A' + (frame + 1) + ' exactly');
    const death = suiteFrames.get(['death', direction, frame].join('/'));
    const sourceFrame = EN_E03_BANNER_KHAN_DEATH_SOURCE_FRAMES[frame];
    check(pixelsEqual(death, hurt[sourceFrame]), direction + '/Death D' + (frame + 1) + ' must alias Banner Khan Hurt H' + (sourceFrame + 1) + ' exactly');
  }
}

const candidateDigest = digestRecords(suiteRecords);
if (EN_E03_BANNER_KHAN_MOTION_GATE.candidateFrameDigest) check(candidateDigest === EN_E03_BANNER_KHAN_MOTION_GATE.candidateFrameDigest, 'the frozen 80-frame Banner Khan suite digest drifted');
if (EN_E03_BANNER_KHAN_MOTION_GATE.artifactSha256) check(await sha256File(EN_E03_BANNER_KHAN_MOTION_GATE.artifact) === EN_E03_BANNER_KHAN_MOTION_GATE.artifactSha256, 'the raw grouped review board drifted');
if (EN_E03_BANNER_KHAN_MOTION_GATE.assembledArtifactSha256) check(await sha256File(EN_E03_BANNER_KHAN_MOTION_GATE.assembledArtifact) === EN_E03_BANNER_KHAN_MOTION_GATE.assembledArtifactSha256, 'the Complete B + Form grouped review board drifted');
for (const animation of Object.values(EN_E03_BANNER_KHAN_MOTION_GATE.reviewAnimations)) {
  if (animation.sha256) check(await sha256File(animation.artifact) === animation.sha256, animation.artifact + ' drifted from its frozen hash');
  check(animation.width === 640 && animation.height === 672 && animation.frames === 4 && animation.durationMs === 720, 'each grouped review GIF must retain the 640x672 four-phase 720 ms contract');
}

try {
  EN_E03_BANNER_KHAN_MOTION_RENDERER.render({ family: { id: 'giant' }, variant: { id: 'banner-khan' } });
  errors.push('the grouped renderer must reject a non-Centaur family');
} catch (error) {
  check(error instanceof TypeError && error.message.includes('restricted to Centaur'), 'the grouped renderer rejected a non-Centaur family with an unexpected error');
}

if (errors.length) {
  console.error('EN-E03 Banner Khan grouped motion validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Banner Khan grouped motion validation passed.');
console.log('- Approved Banner Khan Idle frames preserved: 8 / 8');
console.log('- Approved Steppe motion sources preserved: Walk 16 / Attack 16 / Hurt 8');
console.log('- Banner Khan suite frames: ' + suiteRecords.length + ' / 80');
console.log('- Connected hard-alpha elite silhouettes: ' + connectedFrames + ' / 80');
console.log('- Exact side mirrors: 20 / 20');
console.log('- Cast-to-Attack aliases: 16 / 16');
console.log('- Death-to-Hurt aliases: 16 / 16');
console.log('- Banner pixels across colored frames: ' + bannerPixels);
console.log('- Lamellar pixels across colored frames: ' + armorPixels);
console.log('- Crimson cloth pixels across colored frames: ' + clothPixels);
console.log('- Fur-collar pixels across colored frames: ' + furPixels);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: ' + EN_E03_BANNER_KHAN_MOTION_REGISTRY.publicFamilies.length);
console.log('- Candidate frame digest: ' + candidateDigest);
