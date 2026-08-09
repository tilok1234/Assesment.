import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT,
  EN_E04_BIRDFOLK_AERIE_SCOUT_GATE,
  EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY,
} from '../engine/enemy-expansion-en-e04-birdfolk-aerie-scout.js';
import {
  EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT,
  EN_E04_BIRDFOLK_GALE_AUGUR_DATA,
  EN_E04_BIRDFOLK_GALE_AUGUR_FAMILY,
  EN_E04_BIRDFOLK_GALE_AUGUR_GATE,
  EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY,
} from '../engine/enemy-expansion-en-e04-birdfolk-gale-augur.js';
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

function frameRecord(captured, direction, animation, frame) {
  return {
    family: 'birdfolk',
    variant: 'gale-augur',
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
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
  return regionSignature(captured, 0, engine.SIZE - 1, 18, 22, true);
}

function pixelsEqual(first, second) {
  return JSON.stringify(first.pixels) === JSON.stringify(second.pixels);
}

function countColors(pixels, colors) {
  return pixels.filter((color) => colors.has(color)).length;
}

function countColorsInRegion(captured, colors, minX, maxX, minY, maxY) {
  let count = 0;
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    if (colors.has(captured.pixels[(y * engine.SIZE) + x])) count++;
  }
  return count;
}

function colorBoundsInRegion(captured, colors, minY, maxY) {
  let minX = engine.SIZE;
  let maxX = -1;
  for (let y = minY; y <= maxY; y++) for (let x = 0; x < engine.SIZE; x++) {
    if (!colors.has(captured.pixels[(y * engine.SIZE) + x])) continue;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
  }
  return maxX < minX ? null : { minX, maxX, width: maxX - minX + 1 };
}

check(EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.status === 'approved', 'the approved Aerie Scout predecessor must remain frozen');
check(EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT.chassis === 'upright-avian-person', 'the approved Aerie Scout source must retain the upright avian chassis');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.id === 'en-e04-birdfolk-gale-augur-full-v1', 'the Gale Augur full-enemy gate id must remain frozen');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.status === 'approved', 'the Gale Augur candidate must retain exact paired visual approval');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.authorizedOn === '2026-08-09', 'the Gale Augur authorization date must remain frozen');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.authorizationEvidence.includes('awesome lets keep going') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.authorizationEvidence.includes('common to specialist') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.authorizationEvidence.includes('did not pre-name that role') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.authorizationEvidence.includes('one complete 80-frame Birdfolk Gale Augur specialist enemy'), 'the gate must preserve the exact continuation evidence, naming decision, and bounded interpretation');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.approvedOn === '2026-08-09' && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.approvalEvidence.includes('said: awesome looks good approved') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.approvalEvidence.includes('Both exact 1428x760 boards had already been opened through the working Aseprite MCP') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.approvalEvidence.includes('all four raw plus all four Complete B + Form phases were inspected directly'), 'the gate must preserve the exact paired approval and live MCP inspection evidence');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.precedingApproval.gateId === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.id, 'the gate must identify Aerie Scout as its approved predecessor');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.precedingApproval.artifactSha256 === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.artifactSha256, 'the Aerie Scout raw board hash must remain frozen');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.precedingApproval.assembledArtifactSha256 === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.assembledArtifactSha256, 'the Aerie Scout assembled board hash must remain frozen');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.precedingApproval.rawAnimationSha256 === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.reviewAnimations.raw.sha256, 'the Aerie Scout raw GIF hash must remain frozen');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.reviewAnimations.completeBForm.sha256, 'the Aerie Scout assembled GIF hash must remain frozen');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.precedingApproval.candidateFrameDigest === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.candidateFrameDigest, 'the Aerie Scout frame digest must remain frozen');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.precedingApproval.publishedCheckpoint === 'a0910312e510ee57b603ee981a279c1f372d6fad' && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.precedingApproval.publishedHandoff === '60df011f86f2bce93e54a7bcd071d53b1ae3497e', 'the gate must retain the exact Aerie Scout publication checkpoints');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.scope.includes('complete 80-frame Birdfolk Gale Augur specialist enemy') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.scope.includes('exact Cast-to-Attack aliases') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.scope.includes('exact Death-to-Hurt aliases'), 'the gate must retain the full 80-frame specialist and alias contract');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.anatomyContract.includes('approved upright Aerie Scout avian silhouette') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.anatomyContract.includes('storm cowl') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.anatomyContract.includes('digitigrade talon legs') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.anatomyContract.includes('floating regalia islands'), 'the gate must retain the approved avian anatomy and connected specialist-regalia contract');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.exclusions.includes('approved Aerie Scout source module and pixels') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.exclusions.includes('Birdfolk elite') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.exclusions.includes('registration') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.exclusions.includes('release'), 'the candidate must exclude source changes, later roles, integration, and release');
check(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.nextGate.includes('Bounded commit, push, and publication of this exact ten-file Gale Augur lane are authorized') && EN_E04_BIRDFOLK_GALE_AUGUR_GATE.nextGate.includes('No Birdfolk elite, additional Birdfolk variants'), 'the approved gate must authorize only bounded Gale Augur publication');
check(Object.isFrozen(EN_E04_BIRDFOLK_GALE_AUGUR_GATE) && Object.isFrozen(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.precedingApproval) && Object.isFrozen(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.reviewAnimations) && Object.isFrozen(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.exclusions), 'the Gale Augur gate must be deeply immutable');

check(EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.family === 'birdfolk' && EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.variant === 'gale-augur' && EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.role === 'specialist', 'Gale Augur must remain the specialist Birdfolk role');
check(EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.state === 'implemented-complete-motion-candidate' && EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.chassis === 'upright-avian-person', 'Gale Augur must remain a complete-motion upright-avian candidate');
check(Object.isFrozen(EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT), 'the Gale Augur contract must be immutable');
check(EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY.families.length === 1, 'the lane registry must contain exactly one family');
check(JSON.stringify(EN_E04_BIRDFOLK_GALE_AUGUR_FAMILY.variants.map((variant) => variant.id)) === JSON.stringify(['gale-augur']), 'the lane registry must contain only Gale Augur');
check(EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY.publicFamilies.length === 0 && EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY.approvedFamilies.length === 0, 'the Gale Augur candidate must remain internal and non-public');
check(EN_E04_BIRDFOLK_GALE_AUGUR_DATA.bakedEffects.length === 0, 'all Gale Augur wind and omen effects must remain external');
check(engine.EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY === undefined && engine.EN_E04_BIRDFOLK_GALE_AUGUR_GATE === undefined, 'the Gale Augur candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 67 && engine.ENEMIES.length === 57, 'the Gale Augur candidate must not change public or legacy Enemy counts');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'birdfolk'), 'Birdfolk must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e04-birdfolk-gale-augur') && !facadeSource.includes('EN_E04_BIRDFOLK_GALE_AUGUR'), 'the public facade must not import or expose the Gale Augur candidate');

const directions = Object.freeze(['down', 'left', 'right', 'up']);
const animations = Object.freeze([
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
]);
const galeAugurSpec = Object.freeze({ kind: 'enemy', family: 'birdfolk', variant: 'gale-augur' });
const aerieScoutSpec = Object.freeze({ kind: 'enemy', family: 'birdfolk', variant: 'aerie-scout' });
const frames = new Map();
const records = [];
const palette = EN_E04_BIRDFOLK_GALE_AUGUR_DATA.birdfolk;
const plumageColors = new Set(palette.plumage);
const flightColors = new Set(palette.flight);
const throatColors = new Set(palette.throat);
const stormColors = new Set(palette.storm);
const silverColors = new Set(palette.silver);
const skyColors = new Set(palette.sky);
const beakColors = new Set(palette.beak);
const eyeColors = new Set(palette.eye);
const wingTailColors = new Set([...palette.flight, ...palette.storm]);
const allowedActorColors = new Set(Object.values(palette).flat());
let connectedFrames = 0;
let hardAlphaFrames = 0;
let coloredFrames = 0;
let sourceAlphaPreservedFrames = 0;
let sideEyeFrames = 0;
let rearEyeFreeFrames = 0;
let crestFrames = 0;
let wingArmFrames = 0;
let tailFanFrames = 0;
let talonFrames = 0;
let cowlFrames = 0;
let circletFrames = 0;
let mantleFrames = 0;
let runeFrames = 0;
let sideMirrors = 0;
let castAliases = 0;
let deathAliases = 0;
let minOpaquePixels = Infinity;
let maxOpaquePixels = -Infinity;
let specialistChangedPixels = 0;
let plumagePixels = 0;
let flightPixels = 0;
let throatPixels = 0;
let stormPixels = 0;
let silverPixels = 0;
let skyPixels = 0;
let beakPixels = 0;
let eyePixels = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY,
    galeAugurSpec,
    direction,
    animation.id,
    frame,
  );
  const sourceCaptured = captureEnemyExpansionFrame(
    EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY,
    aerieScoutSpec,
    direction,
    animation.id,
    frame,
  );
  const key = [animation.id, direction, frame].join('/');
  const label = 'Gale Augur/' + direction + '/' + animation.id + '/' + (frame + 1);
  frames.set(key, captured);
  records.push(frameRecord(captured, direction, animation.id, frame));
  const sourceAlphaPreserved = sourceCaptured.alpha.every((alpha, index) => alpha === 0 || captured.alpha[index] === 255);
  check(sourceAlphaPreserved, label + ' must preserve the complete approved Aerie Scout alpha footprint');
  if (sourceAlphaPreserved) sourceAlphaPreservedFrames++;
  const changedPixels = captured.pixels.filter((color, index) => color !== sourceCaptured.pixels[index]).length;
  check(changedPixels >= 8, label + ' must remain visibly distinct from approved Aerie Scout; found ' + changedPixels + ' changed pixels');
  specialistChangedPixels += changedPixels;
  const components = componentCount(captured.pixels);
  check(components === 1, label + ' must retain one connected cowl-crest-head-wing-body-leg-talon-tail silhouette; found ' + components + ' components');
  if (components === 1) connectedFrames++;
  const hardAlpha = captured.alpha.every((alpha) => alpha === 0 || alpha === 255);
  check(hardAlpha, label + ' must retain hard alpha');
  if (hardAlpha) hardAlphaFrames++;
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.maxX <= 22 && captured.bounds.minY >= 1 && captured.bounds.maxY <= 22, label + ' must preserve a one-cell canvas margin');
  check(captured.opaquePixels >= 120 && captured.opaquePixels <= 350, label + ' must retain bounded specialist-enemy visual weight; found ' + captured.opaquePixels);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  check(captured.outOfBoundsWrites.length === 0, label + ' must not write outside the 24x24 cell');
  check(captured.renderResult.birdfolkGaleAugurGate === EN_E04_BIRDFOLK_GALE_AUGUR_GATE.id && captured.renderResult.approvedPrecedingGate === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.id && captured.renderResult.role === 'specialist', label + ' must report the Gale Augur gate, approved Aerie source, and specialist role');
  check(captured.renderResult.upperBody === 'approved-beaked-crest-and-wing-arms-with-connected-storm-cowl-circlet-mantle-and-sky-rune', label + ' must report the connected specialist upper-body contract');
  check(captured.renderResult.lowerBody === 'approved-two-digitigrade-legs-with-connected-three-pronged-talons-and-tail-fan', label + ' must report the approved digitigrade talon-and-tail lower body');
  const sourceAnimation = animation.id === 'cast' ? 'attack' : animation.id === 'death' ? 'hurt' : animation.id;
  const sourceFrame = animation.id === 'death' ? [0, 1, 1, 1][frame] : frame;
  const flash = sourceAnimation === 'hurt' && sourceFrame === 0;
  if (flash) {
    check(captured.pixels.every((color) => color === null || color === '#ffffff'), label + ' must flash the complete connected avian silhouette white');
  } else {
    coloredFrames++;
    check(captured.pixels.every((color) => color === null || allowedActorColors.has(color)), label + ' must contain only the Gale Augur actor palette and no inherited human/Harpy pixels');
    const framePlumage = countColors(captured.pixels, plumageColors);
    const frameFlight = countColors(captured.pixels, flightColors);
    const frameThroat = countColors(captured.pixels, throatColors);
    const frameStorm = countColors(captured.pixels, stormColors);
    const frameSilver = countColors(captured.pixels, silverColors);
    const frameSky = countColors(captured.pixels, skyColors);
    const frameBeak = countColors(captured.pixels, beakColors);
    const frameEyes = countColors(captured.pixels, eyeColors);
    check(framePlumage >= 30 && frameFlight >= 18 && frameStorm >= 8 && frameSilver >= 5 && frameSky >= 2 && frameBeak >= 10, label + ' must retain the complete specialist avian palette identity');
    const cowlPixels = countColorsInRegion(captured, stormColors, 0, 23, 1, 8);
    const circletPixels = countColorsInRegion(captured, silverColors, 0, 23, 2, 7);
    const mantlePixels = countColorsInRegion(captured, stormColors, 0, 23, 8, 15);
    const runePixels = countColorsInRegion(captured, skyColors, 0, 23, 3, 13);
    check(cowlPixels >= 4, label + ' must retain the connected storm cowl');
    check(circletPixels >= 4, label + ' must retain the silver brow circlet');
    check(mantlePixels >= 6, label + ' must retain the connected shoulder mantle');
    check(runePixels >= 2, label + ' must retain readable cyan sky-rune marks');
    if (cowlPixels >= 4) cowlFrames++;
    if (circletPixels >= 4) circletFrames++;
    if (mantlePixels >= 6) mantleFrames++;
    if (runePixels >= 2) runeFrames++;
    const crestPixels = countColorsInRegion(captured, wingTailColors, 0, 23, 0, 5);
    check(crestPixels >= 4, label + ' must retain one connected crest');
    if (crestPixels >= 4) crestFrames++;
    const leftWingPixels = countColorsInRegion(captured, wingTailColors, 0, 8, 4, 18);
    const rightWingPixels = countColorsInRegion(captured, wingTailColors, 15, 23, 4, 18);
    check(leftWingPixels + rightWingPixels >= 15, label + ' must retain readable shoulder-rooted wing-arms');
    if (leftWingPixels + rightWingPixels >= 15) wingArmFrames++;
    const tailPixels = countColorsInRegion(captured, wingTailColors, 0, 23, 15, 21);
    check(tailPixels >= 10, label + ' must retain a connected lower tail fan');
    if (tailPixels >= 10) tailFanFrames++;
    const lowerTalonPixels = countColorsInRegion(captured, beakColors, 0, 23, 15, 22);
    const talonBounds = colorBoundsInRegion(captured, beakColors, 15, 22);
    check(lowerTalonPixels >= 12 && talonBounds && talonBounds.width >= 7, label + ' must retain two readable digitigrade talon contacts');
    if (lowerTalonPixels >= 12 && talonBounds && talonBounds.width >= 7) talonFrames++;
    if (direction === 'left' || direction === 'right') {
      check(frameEyes === 2, label + ' must retain the two-pixel ice-blue side-eye treatment');
      if (frameEyes === 2) sideEyeFrames++;
    } else if (direction === 'down') {
      check(frameEyes === 4 && frameThroat >= 4, label + ' must retain paired front eyes and the pale ritual throat bib');
    } else {
      check(frameEyes === 0, label + ' rear view must not leak front/side eye pixels');
      if (frameEyes === 0) rearEyeFreeFrames++;
    }
    plumagePixels += framePlumage;
    flightPixels += frameFlight;
    throatPixels += frameThroat;
    stormPixels += frameStorm;
    silverPixels += frameSilver;
    skyPixels += frameSky;
    beakPixels += frameBeak;
    eyePixels += frameEyes;
  }
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_BIRDFOLK_GALE_AUGUR_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

check(records.length === 80, 'the full Gale Augur suite must contain exactly 80 frames');
check(connectedFrames === 80, 'all 80 Gale Augur frames must be one connected silhouette');
check(hardAlphaFrames === 80, 'all 80 Gale Augur frames must retain hard alpha');
check(sourceAlphaPreservedFrames === 80, 'all 80 Gale Augur frames must preserve the complete approved Aerie Scout alpha footprint');
check(coloredFrames === 72, 'the suite must retain exactly 72 colored frames and eight complete-white Hurt aliases');
check(crestFrames === 72 && wingArmFrames === 72 && tailFanFrames === 72 && talonFrames === 72, 'all 72 colored frames must retain crest, wing-arm, tail-fan, and talon anatomy');
check(cowlFrames === 72 && circletFrames === 72 && mantleFrames === 72 && runeFrames === 72, 'all 72 colored frames must retain cowl, circlet, mantle, and sky-rune specialist identity');
check(sideEyeFrames === 36 && rearEyeFreeFrames === 18, 'all 36 colored side frames must retain two eye pixels and all 18 colored rear frames must remain eye-free');
check(plumagePixels > 2200 && flightPixels > 1800 && throatPixels > 250 && stormPixels > 500 && silverPixels > 350 && skyPixels > 150 && beakPixels > 850 && eyePixels >= 140, 'the 72 colored frames must retain the complete Gale Augur palette identity');
check(specialistChangedPixels > 8000, 'the complete Gale Augur suite must remain materially distinct from approved Aerie Scout');
check(completeOutlinePixels > 0 && formChangedPixels > 0, 'Complete B and Form must both materially change the presentation');

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = frames.get([animation.id, 'left', frame].join('/'));
  const right = frames.get([animation.id, 'right', frame].join('/'));
  const exactMirror = JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE));
  check(exactMirror, 'Gale Augur ' + animation.id + '/' + (frame + 1) + ' Left must be the exact mirror of Right');
  if (exactMirror) sideMirrors++;
  const down = frames.get([animation.id, 'down', frame].join('/'));
  const up = frames.get([animation.id, 'up', frame].join('/'));
  check(down.digest !== up.digest, 'Gale Augur ' + animation.id + '/' + (frame + 1) + ' Down and Up must remain directionally distinct');
}

for (const direction of directions) {
  const walk = [0, 1, 2, 3].map((frame) => frames.get(['walk', direction, frame].join('/')));
  check(new Set(walk.map((captured) => captured.digest)).size === 4, direction + ' Gale Augur Walk must contain four visually distinct frames');
  check(new Set(walk.map(groundSignature)).size === 4, direction + ' Gale Augur Walk must preserve four distinct talon-and-tail phases');
  const attack = [0, 1, 2, 3].map((frame) => frames.get(['attack', direction, frame].join('/')));
  check(new Set(attack.map((captured) => captured.digest)).size === 4, direction + ' Gale Augur Attack must contain four distinct full-body phases');
  const hurt = [0, 1].map((frame) => frames.get(['hurt', direction, frame].join('/')));
  check(hurt[0].alphaDigest !== hurt[1].alphaDigest, direction + ' Gale Augur Hurt must contain distinct recoil and recovery silhouettes');
  for (let frame = 0; frame < 4; frame++) {
    const attackFrame = frames.get(['attack', direction, frame].join('/'));
    const castFrame = frames.get(['cast', direction, frame].join('/'));
    const exact = pixelsEqual(attackFrame, castFrame) && attackFrame.digest === castFrame.digest;
    check(exact, direction + ' Cast C' + (frame + 1) + ' must alias Attack A' + (frame + 1) + ' exactly');
    if (exact) castAliases++;
    const sourceFrame = [0, 1, 1, 1][frame];
    const hurtFrame = frames.get(['hurt', direction, sourceFrame].join('/'));
    const deathFrame = frames.get(['death', direction, frame].join('/'));
    const deathExact = pixelsEqual(hurtFrame, deathFrame) && hurtFrame.digest === deathFrame.digest;
    check(deathExact, direction + ' Death D' + (frame + 1) + ' must alias Hurt H' + (sourceFrame + 1) + ' exactly');
    if (deathExact) deathAliases++;
  }
}

check(sideMirrors === 20, 'all 20 Left/Right animation phases must be exact mirrors');
check(castAliases === 16, 'all 16 Cast frames must be exact Attack aliases');
check(deathAliases === 16, 'all 16 Death frames must be exact Hurt aliases');

const candidateDigest = digestRecords(records);
if (EN_E04_BIRDFOLK_GALE_AUGUR_GATE.candidateFrameDigest) {
  check(candidateDigest === EN_E04_BIRDFOLK_GALE_AUGUR_GATE.candidateFrameDigest, 'the 80-frame candidate digest must match the frozen review evidence');
}
if (EN_E04_BIRDFOLK_GALE_AUGUR_GATE.artifactSha256) {
  check(await sha256File(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.artifact) === EN_E04_BIRDFOLK_GALE_AUGUR_GATE.artifactSha256, 'the exact raw board hash must match the frozen gate');
  check(await sha256File(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.assembledArtifact) === EN_E04_BIRDFOLK_GALE_AUGUR_GATE.assembledArtifactSha256, 'the exact Complete B + Form board hash must match the frozen gate');
  check(await sha256File(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.reviewAnimations.raw.artifact) === EN_E04_BIRDFOLK_GALE_AUGUR_GATE.reviewAnimations.raw.sha256, 'the exact raw GIF hash must match the frozen gate');
  check(await sha256File(EN_E04_BIRDFOLK_GALE_AUGUR_GATE.reviewAnimations.completeBForm.artifact) === EN_E04_BIRDFOLK_GALE_AUGUR_GATE.reviewAnimations.completeBForm.sha256, 'the exact Complete B + Form GIF hash must match the frozen gate');
}

let rejectedWrongVariant = false;
let rejectedWrongFamily = false;
try {
  captureEnemyExpansionFrame(
    EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY,
    { kind: 'enemy', family: 'birdfolk', variant: 'aerie-scout' },
    'down',
    'idle',
    0,
  );
} catch {
  rejectedWrongVariant = true;
}
try {
  captureEnemyExpansionFrame(
    EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY,
    { kind: 'enemy', family: 'harpy', variant: 'screech' },
    'down',
    'idle',
    0,
  );
} catch {
  rejectedWrongFamily = true;
}
check(rejectedWrongVariant && rejectedWrongFamily, 'the isolated registry must reject approved Aerie Scout, later Birdfolk roles, and the legacy Harpy family');

if (errors.length) {
  console.error('EN-E04 Birdfolk Gale Augur focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E04 Birdfolk Gale Augur focused gate passed.');
  console.log('- Exact scope: 1 family / 1 specialist / 80 frames / 4 directions / 6 animation rows');
  console.log('- Source/anatomy: 80/80 approved Aerie alpha footprints preserved; 80/80 connected');
  console.log('- Specialist identity: 72/72 colored cowl, circlet, mantle, sky-rune, wing-arm, tail-fan, and broad-talon frames');
  console.log('- Directional face: 36/36 colored side frames retain two eye pixels; 18/18 colored rear frames remain eye-free');
  console.log('- Motion: 20/20 side mirrors, 16/16 Cast aliases, 16/16 Death aliases');
  console.log('- Alpha and bounds: 80/80 hard-alpha frames; opaque range ' + minOpaquePixels + '-' + maxOpaquePixels);
  console.log('- Palette totals: plumage ' + plumagePixels + ', flight ' + flightPixels + ', throat ' + throatPixels + ', storm ' + stormPixels + ', silver ' + silverPixels + ', sky ' + skyPixels + ', beak/talon ' + beakPixels + ', eye ' + eyePixels);
  console.log('- Specialist distinction: ' + specialistChangedPixels + ' changed pixels vs approved Aerie Scout');
  console.log('- Presentation: Complete B +' + completeOutlinePixels + ' outline pixels; Form changes ' + formChangedPixels + ' pixels');
  console.log('- Candidate digest: ' + candidateDigest + (EN_E04_BIRDFOLK_GALE_AUGUR_GATE.candidateFrameDigest ? ' (frozen)' : ' (not yet frozen)'));
  console.log('- Public exposure: 0 families; effects remain external; exact paired visual approval is frozen for bounded publication');
}
