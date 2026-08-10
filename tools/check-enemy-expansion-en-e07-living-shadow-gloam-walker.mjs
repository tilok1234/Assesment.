import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import * as engine from '../sprite-engine.js';
import { ENEMY_EXPANSION_LEDGER } from '../engine/enemy-expansion.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E06_FAIRY_GATE,
  EN_E06_FAIRY_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy.js';
import {
  EN_E06_THISTLE_HEXER_GATE,
  EN_E06_THISTLE_HEXER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy-thistle-hexer.js';
import {
  EN_E06_PETALCROWN_DUELIST_GATE,
  EN_E06_PETALCROWN_DUELIST_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy-petalcrown-duelist.js';
import {
  EN_E06_MIRE_CRONE_GATE,
  EN_E06_MIRE_CRONE_REGISTRY,
} from '../engine/enemy-expansion-en-e06-hag-mire-crone.js';
import {
  EN_E06_CAULDRON_HEXER_GATE,
  EN_E06_CAULDRON_HEXER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-hag-cauldron-hexer.js';
import {
  EN_E06_BLACKTHORN_MATRON_GATE,
  EN_E06_BLACKTHORN_MATRON_REGISTRY,
} from '../engine/enemy-expansion-en-e06-hag-blackthorn-matron.js';
import {
  EN_E06_GROVE_TENDER_GATE,
  EN_E06_GROVE_TENDER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-dryad-grove-tender.js';
import {
  EN_E06_SPORE_CANTOR_GATE,
  EN_E06_SPORE_CANTOR_REGISTRY,
} from '../engine/enemy-expansion-en-e06-dryad-spore-cantor.js';
import {
  EN_E06_HEARTWOOD_WARDEN_GATE,
  EN_E06_HEARTWOOD_WARDEN_REGISTRY,
} from '../engine/enemy-expansion-en-e06-dryad-heartwood-warden.js';
import {
  EN_E06_BARROW_STALKER_GATE,
  EN_E06_BARROW_STALKER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-redcap-barrow-stalker.js';
import {
  EN_E06_IRONBOOT_TRAPPER_GATE,
  EN_E06_IRONBOOT_TRAPPER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-redcap-ironboot-trapper.js';
import {
  EN_E06_BLOODCAP_REAVER_GATE,
  EN_E06_BLOODCAP_REAVER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-redcap-bloodcap-reaver.js';
import {
  EN_E06_SPRING_DANCER_GATE,
  EN_E06_SPRING_DANCER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-nymph-spring-dancer.js';
import {
  EN_E06_MIST_WEAVER_GATE,
  EN_E06_MIST_WEAVER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-nymph-mist-weaver.js';
import {
  EN_E06_RIVERCROWN_MUSE_GATE,
  EN_E06_RIVERCROWN_MUSE_REGISTRY,
} from '../engine/enemy-expansion-en-e06-nymph-rivercrown-muse.js';
import {
  EN_E07_GLOAM_WALKER_CONTRACT,
  EN_E07_GLOAM_WALKER_DATA,
  EN_E07_GLOAM_WALKER_DEATH_SOURCE_FRAMES,
  EN_E07_GLOAM_WALKER_FAMILY,
  EN_E07_GLOAM_WALKER_GATE,
  EN_E07_GLOAM_WALKER_REGISTRY,
  EN_E07_LIVING_SHADOW_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e07-living-shadow-gloam-walker.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
  pixelDigest,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};
const directions = ['down', 'left', 'right', 'up'];
const animations = [
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
];
const candidateSpec = { kind: 'enemy', family: 'living-shadow', variant: 'gloam-walker' };
const cursedGhostSpec = { kind: 'enemy', family: 'ghost', variant: 'cursed' };
const shadowSlimeSpec = { kind: 'enemy', family: 'slime', variant: 'shadow' };
const mistWeaverSpec = { kind: 'enemy', family: 'nymph', variant: 'mist-weaver' };
const frameKey = (direction, animation, frame) => direction + '/' + animation + '/' + frame;
const hashJson = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const frameRecord = (captured, family, variant, direction, animation, frame, candidateFamily = true) => ({
  family,
  variant,
  ...(candidateFamily ? { candidateFamily: family } : {}),
  direction,
  animation,
  frame,
  digest: captured.digest,
  alphaDigest: captured.alphaDigest,
  opaquePixels: captured.opaquePixels,
  bounds: captured.bounds,
});

function mirrorPixels(pixels) {
  const result = new Array(576).fill(null);
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    result[(y * 24) + (23 - x)] = pixels[(y * 24) + x];
  }
  return result;
}

function components(pixels) {
  const seen = new Set();
  let count = 0;
  for (let index = 0; index < 576; index++) {
    if (!pixels[index] || seen.has(index)) continue;
    count++;
    const queue = [index];
    seen.add(index);
    while (queue.length) {
      const current = queue.pop();
      const x = current % 24;
      const neighbors = [
        current - 24,
        current + 24,
        x ? current - 1 : -1,
        x < 23 ? current + 1 : -1,
      ];
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && neighbor < 576 && pixels[neighbor] && !seen.has(neighbor)) {
          seen.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
  return count;
}

function countColors(pixels, colors) {
  return pixels.reduce((sum, color) => sum + (colors.has(color) ? 1 : 0), 0);
}

function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(576).fill(null);
  const outOfBoundsWrites = [];
  let fillStyle = '#000000';
  const context = {
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value) {
      fillStyle = value;
    },
    clearRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px < 0 || py < 0 || px >= 24 || py >= 24) {
          outOfBoundsWrites.push({ x: px, y: py, operation: 'clearRect' });
        } else {
          pixels[(py * 24) + px] = null;
        }
      }
    },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px < 0 || py < 0 || px >= 24 || py >= 24) {
          outOfBoundsWrites.push({ x: px, y: py, operation: 'fillRect', color: fillStyle });
        } else {
          pixels[(py * 24) + px] = fillStyle;
        }
      }
    },
  };
  drawLegacySprite(context, spec, direction, animation, frame, { shadow: false });
  const occupied = pixels.flatMap((color, index) => (
    color === null ? [] : [{ x: index % 24, y: Math.floor(index / 24) }]
  ));
  const bounds = occupied.length ? {
    minX: Math.min(...occupied.map(({ x }) => x)),
    minY: Math.min(...occupied.map(({ y }) => y)),
    maxX: Math.max(...occupied.map(({ x }) => x)),
    maxY: Math.max(...occupied.map(({ y }) => y)),
  } : null;
  return Object.freeze({
    pixels: Object.freeze(pixels),
    opaquePixels: occupied.length,
    bounds: bounds && Object.freeze(bounds),
    outOfBoundsWrites: Object.freeze(outOfBoundsWrites),
    digest: pixelDigest(pixels),
    alphaDigest: alphaDigest(pixels),
  });
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

function rejects(action, label) {
  try {
    action();
    errors.push(label + ' must reject');
  } catch (error) {
    check(String(error.message).includes('is not implemented'), label + ' rejected unexpectedly: ' + error.message);
  }
}

check(
  EN_E07_GLOAM_WALKER_GATE.status === 'approved'
    && EN_E07_GLOAM_WALKER_GATE.approvedOn === '2026-08-10'
    && EN_E07_GLOAM_WALKER_GATE.approvedImplementation === 'a46f59c1cb0bb751760f2776fe60b5c489806c94'
    && EN_E07_GLOAM_WALKER_GATE.publishedImplementation === 'a46f59c1cb0bb751760f2776fe60b5c489806c94'
    && EN_E07_GLOAM_WALKER_GATE.publishedApprovalRecord === '848c7192b6dc2cac8b7ab2dc8725d3859447715d'
    && EN_E07_GLOAM_WALKER_GATE.initialPublishedHandoff === '00d5b436c7398312a5f3a05a482b4cf34cee9ba5',
  'Gloam Walker approved publication state drifted',
);
check(
  EN_E07_GLOAM_WALKER_GATE.approvalEvidence.includes('three exact PNG review boards were opened together in Aseprite')
    && EN_E07_GLOAM_WALKER_GATE.approvalEvidence.includes('designer replied: aaprovced')
    && EN_E07_GLOAM_WALKER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E07_GLOAM_WALKER_GATE.publicationAuthorizationEvidence.includes('only after explicit approval')
    && EN_E07_GLOAM_WALKER_GATE.publicationState === 'published',
  'approval evidence or publication authorization drifted',
);
check(
  EN_E07_GLOAM_WALKER_GATE.authorizationEvidence.includes('designer said: lets do next')
    && EN_E07_GLOAM_WALKER_GATE.authorizationEvidence.includes('queues EN-E07 next')
    && EN_E07_GLOAM_WALKER_GATE.authorizationEvidence.includes('only one private common Living Shadow Gloam Walker'),
  'authorization evidence or bounded interpretation drifted',
);
check(
  EN_E07_GLOAM_WALKER_GATE.baseCheckpoint === 'd785fe56e7d8c98243f948fce615885d5a04fbc3'
    && EN_E07_GLOAM_WALKER_GATE.precedingApproval.gateId === EN_E06_RIVERCROWN_MUSE_GATE.id
    && EN_E07_GLOAM_WALKER_GATE.precedingApproval.candidateFrameDigest === EN_E06_RIVERCROWN_MUSE_GATE.candidateFrameDigest
    && EN_E07_GLOAM_WALKER_GATE.precedingApproval.approvalRecord === 'ca82f079ff84934edc4ab51a8d406050b9083d2a'
    && EN_E07_GLOAM_WALKER_GATE.precedingApproval.reconciliationPublication === 'published',
  'Rivercrown predecessor publication state drifted',
);
check(
  EN_E07_GLOAM_WALKER_GATE.scope.includes('complete 80-frame Gloam Walker common')
    && EN_E07_GLOAM_WALKER_GATE.animationContract.includes('two-arm rake')
    && EN_E07_GLOAM_WALKER_GATE.animationContract.includes('Cast aliases Attack exactly'),
  'full-suite or motion contract drifted',
);
check(
  EN_E07_GLOAM_WALKER_GATE.exclusions.includes('public Living Shadow registration')
    && EN_E07_GLOAM_WALKER_GATE.exclusions.includes('asset-pack fixture generation or regeneration')
    && EN_E07_GLOAM_WALKER_GATE.exclusions.includes('Doppelganger')
    && EN_E07_GLOAM_WALKER_GATE.exclusions.includes('EN-E08 and later work'),
  'scope exclusions drifted',
);
check(
  EN_E07_GLOAM_WALKER_GATE.nextGate.includes('visually approved and published')
    && EN_E07_GLOAM_WALKER_GATE.nextGate.includes('Stop at this clean published checkpoint')
    && EN_E07_GLOAM_WALKER_GATE.nextGate.includes('without another explicit gate'),
  'published stop gate drifted',
);
check(
  Object.isFrozen(EN_E07_GLOAM_WALKER_GATE)
    && Object.isFrozen(EN_E07_GLOAM_WALKER_DATA)
    && Object.isFrozen(EN_E07_LIVING_SHADOW_CONTRACT_CARD),
  'gate, data, and contract card must be deeply immutable',
);
check(
  JSON.stringify(EN_E07_LIVING_SHADOW_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeVariant.id === 'gloam-walker'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeSpecialist.id === 'nightglass-seer'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeSpecialist.role === 'specialist'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeSpecialist.status === 'implemented-full-approved'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeElite.id === 'hollowcrown-regent'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeElite.role === 'elite'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.activeElite.status === 'implemented-full-candidate'
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.deferredRoles.length === 0,
  'Living Shadow role order or one-active-role boundary drifted',
);
check(
  EN_E07_LIVING_SHADOW_CONTRACT_CARD.styleContract.includes('chunky one-to-three-pixel forms')
    && EN_E07_LIVING_SHADOW_CONTRACT_CARD.styleContract.includes('connected negative-space cutouts')
    && EN_E07_GLOAM_WALKER_CONTRACT.silhouette.includes('public Ghost floating robe')
    && EN_E07_GLOAM_WALKER_CONTRACT.silhouette.includes('two clearly split legs'),
  'style or silhouette firewall drifted',
);
check(
  ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E06')?.gate === 'eight-enemy-registration-authorized-2026-08-09'
    && ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E07')?.gate === 'queued',
  'isolated candidate must not rewrite the approved EN-E06 gate or queued EN-E07 ledger',
);
check(
  EN_E07_GLOAM_WALKER_REGISTRY.families.length === 1
    && EN_E07_GLOAM_WALKER_REGISTRY.publicFamilies.length === 0
    && EN_E07_GLOAM_WALKER_FAMILY.variants.length === 1,
  'candidate registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'living-shadow'),
  'candidate must preserve public 80/259 and keep Living Shadow private',
);
check(engine.EN_E07_GLOAM_WALKER_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(
  !publicSource.includes('enemy-expansion-en-e07-living-shadow-gloam-walker')
    && !facadeSource.includes('enemy-expansion-en-e07-living-shadow-gloam-walker')
    && !manifestSource.includes('gloam-walker'),
  'public or fixture firewall drifted',
);

const captures = new Map();
const candidateRecords = [];
const cursedGhostRecords = [];
const shadowSlimeRecords = [];
const mistWeaverRecords = [];
const palettes = ['body', 'void', 'rim', 'claw'].map((name) => [
  name,
  new Set(EN_E07_GLOAM_WALKER_DATA.gloamWalker[name]),
]);
let connected = 0;
let bounded = 0;
let grounded = 0;
let colored = 0;
let flashes = 0;
let eyeFrames = 0;
let cursedGhostDifferences = 0;
let cursedGhostAlphaDifferences = 0;
let shadowSlimeDifferences = 0;
let shadowSlimeAlphaDifferences = 0;
let mistWeaverDifferences = 0;
let mistWeaverAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;
let minOpaque = Infinity;
let maxOpaque = 0;

for (const animation of animations) for (const direction of directions) {
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = frameKey(direction, animation.id, frame);
    const candidate = captureEnemyExpansionFrame(
      EN_E07_GLOAM_WALKER_REGISTRY,
      candidateSpec,
      direction,
      animation.id,
      frame,
    );
    const cursedGhost = captureLegacyFrame(cursedGhostSpec, direction, animation.id, frame);
    const shadowSlime = captureLegacyFrame(shadowSlimeSpec, direction, animation.id, frame);
    const mistWeaver = captureEnemyExpansionFrame(
      EN_E06_MIST_WEAVER_REGISTRY,
      mistWeaverSpec,
      direction,
      animation.id,
      frame,
    );
    captures.set(key, candidate);
    candidateRecords.push(frameRecord(candidate, 'living-shadow', 'gloam-walker', direction, animation.id, frame));
    cursedGhostRecords.push(frameRecord(cursedGhost, 'ghost', 'cursed', direction, animation.id, frame, false));
    shadowSlimeRecords.push(frameRecord(shadowSlime, 'slime', 'shadow', direction, animation.id, frame, false));
    mistWeaverRecords.push(frameRecord(mistWeaver, 'nymph', 'mist-weaver', direction, animation.id, frame));

    check(
      candidate.outOfBoundsWrites.length === 0
        && candidate.alpha.every((value) => value === 0 || value === 255),
      key + ' must stay in-cell with hard alpha',
    );
    const isBounded = candidate.bounds
      && candidate.bounds.minX >= 1
      && candidate.bounds.minY >= 1
      && candidate.bounds.maxX <= 22
      && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++;
    else check(false, key + ' lost one-cell margin');

    const isGrounded = candidate.bounds
      && candidate.bounds.maxY >= 21
      && candidate.bounds.maxY <= 22;
    if (isGrounded) grounded++;
    else check(false, key + ' lost split-foot ground contact');

    const componentCount = components(candidate.pixels);
    if (componentCount === 1) connected++;
    else check(false, key + ' has ' + componentCount + ' opaque components');

    check(
      candidate.opaquePixels >= 120 && candidate.opaquePixels <= 280,
      key + ' density ' + candidate.opaquePixels + ' is implausible for a gaunt Living Shadow',
    );
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(cursedGhost.pixels)) cursedGhostDifferences++;
    else check(false, key + ' must differ from public Cursed Ghost');
    if (candidate.alphaDigest !== cursedGhost.alphaDigest) cursedGhostAlphaDifferences++;

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(shadowSlime.pixels)) shadowSlimeDifferences++;
    else check(false, key + ' must differ from public Shadow Slime');
    if (candidate.alphaDigest !== shadowSlime.alphaDigest) shadowSlimeAlphaDifferences++;

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(mistWeaver.pixels)) mistWeaverDifferences++;
    else check(false, key + ' must differ from approved Mist Weaver');
    if (candidate.alphaDigest !== mistWeaver.alphaDigest) mistWeaverAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(
        colors.size === 1 && colors.has('#f4f4f4'),
        key + ' must be an exact whole-silhouette white flash',
      );
      flashes++;
    } else {
      for (const [name, colors] of palettes) {
        check(countColors(candidate.pixels, colors) > 0, key + ' lost ' + name + ' style-ramp identity');
      }
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_GLOAM_WALKER_DATA.gloamWalker.eye]));
      if (direction === 'up') {
        check(eyeCount === 0, key + ' rear view must not expose eye pixels');
      } else {
        check(eyeCount > 0, key + ' front or side view lost the connected eye slit');
        if (eyeCount > 0) eyeFrames++;
      }
      colored++;
    }

    check(
      candidate.renderResult.gloamWalkerGate === EN_E07_GLOAM_WALKER_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E06_RIVERCROWN_MUSE_GATE.id,
      key + ' gate metadata drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(
      candidate.pixels,
      EN_E07_GLOAM_WALKER_DATA,
    );
    completeB += presentation.formComplete.reduce(
      (sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0),
      0,
    );
    formChanges += presentation.form.reduce(
      (sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0),
      0,
    );
  }
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  check(
    JSON.stringify(captures.get(frameKey('left', animation.id, frame)).pixels)
      === JSON.stringify(mirrorPixels(captures.get(frameKey('right', animation.id, frame)).pixels)),
    'side mirror drifted ' + animation.id + '/' + frame,
  );
  check(
    captures.get(frameKey('down', animation.id, frame)).digest
      !== captures.get(frameKey('up', animation.id, frame)).digest,
    'Down/Up silhouette must differ ' + animation.id + '/' + frame,
  );
}

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame++) {
    check(
      JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels)
        === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels),
      direction + ' Cast alias drifted C' + (frame + 1),
    );
    const source = EN_E07_GLOAM_WALKER_DEATH_SOURCE_FRAMES[frame];
    check(
      JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels)
        === JSON.stringify(captures.get(frameKey(direction, 'hurt', source)).pixels),
      direction + ' Death alias drifted D' + (frame + 1),
    );
  }
  check(
    new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2,
    direction + ' Idle must have two distinct frames',
  );
  check(
    new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4,
    direction + ' Walk must have four distinct frames',
  );
  check(
    new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4,
    direction + ' Attack must have four distinct frames',
  );
}

const candidateDigest = hashJson(candidateRecords);
const cursedGhostDigest = hashJson(cursedGhostRecords);
const shadowSlimeDigest = hashJson(shadowSlimeRecords);
const mistWeaverDigest = hashJson(mistWeaverRecords);
if (EN_E07_GLOAM_WALKER_GATE.candidateFrameDigest) {
  check(candidateDigest === EN_E07_GLOAM_WALKER_GATE.candidateFrameDigest, 'candidate digest drifted');
}
if (EN_E07_GLOAM_WALKER_GATE.cursedGhostComparisonDigest) {
  check(cursedGhostDigest === EN_E07_GLOAM_WALKER_GATE.cursedGhostComparisonDigest, 'Cursed Ghost digest drifted');
}
if (EN_E07_GLOAM_WALKER_GATE.shadowSlimeComparisonDigest) {
  check(shadowSlimeDigest === EN_E07_GLOAM_WALKER_GATE.shadowSlimeComparisonDigest, 'Shadow Slime digest drifted');
}
check(
  mistWeaverDigest === EN_E07_GLOAM_WALKER_GATE.mistWeaverComparisonDigest,
  'Mist Weaver comparison digest drifted',
);
check(
  cursedGhostDifferences === 80
    && cursedGhostAlphaDifferences === 80
    && shadowSlimeDifferences === 80
    && shadowSlimeAlphaDifferences === 80
    && mistWeaverDifferences === 80
    && mistWeaverAlphaDifferences === 80
    && connected === 80
    && bounded === 80
    && grounded === 80
    && colored === 72
    && flashes === 8
    && eyeFrames === 54,
  'suite totals drifted: Ghost '
    + cursedGhostDifferences + '/80 pixels ' + cursedGhostAlphaDifferences
    + '/80 alpha; Slime ' + shadowSlimeDifferences + '/80 pixels '
    + shadowSlimeAlphaDifferences + '/80 alpha; Mist ' + mistWeaverDifferences
    + '/80 pixels ' + mistWeaverAlphaDifferences + '/80 alpha; structure '
    + connected + '/' + bounded + '/' + grounded + '; identity '
    + colored + '/72 colored ' + flashes + '/8 flashes ' + eyeFrames + '/54 eye-bearing frames',
);
check(completeB > 0 && formChanges > 0, 'Complete B/Form presentation must change pixels');

const approvedSuites = [
  [EN_E06_FAIRY_REGISTRY, 'fairy', 'bramblewing-scout', EN_E06_FAIRY_GATE, true],
  [EN_E06_THISTLE_HEXER_REGISTRY, 'fairy', 'thistle-hexer', EN_E06_THISTLE_HEXER_GATE, true],
  [EN_E06_PETALCROWN_DUELIST_REGISTRY, 'fairy', 'petalcrown-duelist', EN_E06_PETALCROWN_DUELIST_GATE, true],
  [EN_E06_MIRE_CRONE_REGISTRY, 'hag', 'mire-crone', EN_E06_MIRE_CRONE_GATE, false],
  [EN_E06_CAULDRON_HEXER_REGISTRY, 'hag', 'cauldron-hexer', EN_E06_CAULDRON_HEXER_GATE, true],
  [EN_E06_BLACKTHORN_MATRON_REGISTRY, 'hag', 'blackthorn-matron', EN_E06_BLACKTHORN_MATRON_GATE, true],
  [EN_E06_GROVE_TENDER_REGISTRY, 'dryad', 'grove-tender', EN_E06_GROVE_TENDER_GATE, true],
  [EN_E06_SPORE_CANTOR_REGISTRY, 'dryad', 'spore-cantor', EN_E06_SPORE_CANTOR_GATE, true],
  [EN_E06_HEARTWOOD_WARDEN_REGISTRY, 'dryad', 'heartwood-warden', EN_E06_HEARTWOOD_WARDEN_GATE, true],
  [EN_E06_BARROW_STALKER_REGISTRY, 'redcap', 'barrow-stalker', EN_E06_BARROW_STALKER_GATE, true],
  [EN_E06_IRONBOOT_TRAPPER_REGISTRY, 'redcap', 'ironboot-trapper', EN_E06_IRONBOOT_TRAPPER_GATE, true],
  [EN_E06_BLOODCAP_REAVER_REGISTRY, 'redcap', 'bloodcap-reaver', EN_E06_BLOODCAP_REAVER_GATE, true],
  [EN_E06_SPRING_DANCER_REGISTRY, 'nymph', 'spring-dancer', EN_E06_SPRING_DANCER_GATE, true],
  [EN_E06_MIST_WEAVER_REGISTRY, 'nymph', 'mist-weaver', EN_E06_MIST_WEAVER_GATE, true],
  [EN_E06_RIVERCROWN_MUSE_REGISTRY, 'nymph', 'rivercrown-muse', EN_E06_RIVERCROWN_MUSE_GATE, true],
];

for (const [registry, family, variant, gate, candidateFamily] of approvedSuites) {
  const records = [];
  for (const animation of animations) for (const direction of directions) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const captured = captureEnemyExpansionFrame(
        registry,
        { kind: 'enemy', family, variant },
        direction,
        animation.id,
        frame,
      );
      records.push(frameRecord(captured, family, variant, direction, animation.id, frame, candidateFamily));
    }
  }
  check(hashJson(records) === gate.candidateFrameDigest, 'approved ' + variant + ' digest drifted');
}

const artifacts = [
  [EN_E07_GLOAM_WALKER_GATE.artifact, EN_E07_GLOAM_WALKER_GATE.artifactSha256],
  [EN_E07_GLOAM_WALKER_GATE.assembledArtifact, EN_E07_GLOAM_WALKER_GATE.assembledArtifactSha256],
  [EN_E07_GLOAM_WALKER_GATE.comparisonArtifact, EN_E07_GLOAM_WALKER_GATE.comparisonArtifactSha256],
  [EN_E07_GLOAM_WALKER_GATE.reviewAnimations.raw.artifact, EN_E07_GLOAM_WALKER_GATE.reviewAnimations.raw.sha256],
  [EN_E07_GLOAM_WALKER_GATE.reviewAnimations.completeBForm.artifact, EN_E07_GLOAM_WALKER_GATE.reviewAnimations.completeBForm.sha256],
];
for (const [artifact, expected] of artifacts) {
  if (expected) check(await sha256File(artifact) === expected, artifact + ' hash drifted');
}

rejects(
  () => engine.renderEnemyExpansionFrame(
    EN_E07_GLOAM_WALKER_REGISTRY,
    { kind: 'enemy', family: 'living-shadow', variant: 'specialist-planned' },
    'down',
    'idle',
    0,
    {},
  ),
  'planned Living Shadow specialist through isolated Gloam Walker registry',
);
for (const family of ['doppelganger', 'will-o-wisp', 'changeling', 'kelpie']) {
  rejects(
    () => engine.renderEnemyExpansionFrame(
      EN_E07_GLOAM_WALKER_REGISTRY,
      { kind: 'enemy', family, variant: 'planned' },
      'down',
      'idle',
      0,
      {},
    ),
    family,
  );
}

if (errors.length) {
  console.error('EN-E07 Living Shadow Gloam Walker focused validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E07 Living Shadow Gloam Walker focused gate passed.');
console.log('- Cursed Ghost distinction: ' + cursedGhostDifferences + '/80 pixel frames and ' + cursedGhostAlphaDifferences + '/80 alpha silhouettes differ');
console.log('- Shadow Slime distinction: ' + shadowSlimeDifferences + '/80 pixel frames and ' + shadowSlimeAlphaDifferences + '/80 alpha silhouettes differ');
console.log('- Mist Weaver distinction: ' + mistWeaverDifferences + '/80 pixel frames and ' + mistWeaverAlphaDifferences + '/80 alpha silhouettes differ');
console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
console.log('- Style identity: ' + colored + '/72 colored ramp frames; ' + flashes + '/8 exact white flashes; ' + eyeFrames + '/54 expected eye-bearing views');
console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
console.log('- Protected: all fifteen approved EN-E06 sources exact; public 80/259; fixtures unchanged');
console.log('- Candidate digest: ' + candidateDigest);
console.log('- Public Cursed Ghost frame digest: ' + cursedGhostDigest);
console.log('- Public Shadow Slime frame digest: ' + shadowSlimeDigest);
console.log('- Approved Mist Weaver frame digest: ' + mistWeaverDigest);
