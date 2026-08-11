import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import * as engine from '../sprite-engine.js';
import { ENEMY_EXPANSION_LEDGER } from '../engine/enemy-expansion.js';
import { EN_E01_PUBLIC_REGISTRY } from '../engine/enemy-expansion-en-e01.js';
import {
  EN_E08_CROWNVAULT_CASTELLAN_GATE,
  EN_E08_CROWNVAULT_CASTELLAN_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-crownvault-castellan.js';
import {
  EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION,
  EN_E08_OATHBITE_CLEAVER_GATE,
  EN_E08_OATHBITE_CLEAVER_REGISTRY,
} from '../engine/enemy-expansion-en-e08-living-weapon-oathbite-cleaver.js';
import {
  EN_E08_VOWCOIL_GLAIVE_GATE,
  EN_E08_VOWCOIL_GLAIVE_REGISTRY,
} from '../engine/enemy-expansion-en-e08-living-weapon-vowcoil-glaive.js';
import {
  EN_E08_CROWNMAW_GREATBLADE_CONTRACT,
  EN_E08_CROWNMAW_GREATBLADE_DATA,
  EN_E08_CROWNMAW_GREATBLADE_DEATH_SOURCE_FRAMES,
  EN_E08_CROWNMAW_GREATBLADE_FAMILY,
  EN_E08_CROWNMAW_GREATBLADE_GATE,
  EN_E08_CROWNMAW_GREATBLADE_REGISTRY,
  EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e08-living-weapon-crownmaw-greatblade.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

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
const candidateSpec = { kind: 'enemy', family: 'living-weapon', variant: 'crownmaw-greatblade' };
const fallenKnightSpec = { kind: 'enemy', family: 'fallen-knight', variant: 'shieldbearer' };
const crownvaultCastellanSpec = { kind: 'enemy', family: 'animated-armor', variant: 'crownvault-castellan' };
const oathbiteCleaverSpec = { kind: 'enemy', family: 'living-weapon', variant: 'oathbite-cleaver' };
const vowcoilGlaiveSpec = { kind: 'enemy', family: 'living-weapon', variant: 'vowcoil-glaive' };
const frameKey = (direction, animation, frame) => `${direction}/${animation}/${frame}`;
const hashJson = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const frameRecord = (captured, spec, direction, animation, frame, candidateFamily = true) => ({
  family: spec.family,
  variant: spec.variant,
  ...(candidateFamily ? { candidateFamily: spec.family } : {}),
  direction,
  animation,
  frame,
  digest: captured.digest,
  alphaDigest: captured.alphaDigest,
  opaquePixels: captured.opaquePixels,
  bounds: captured.bounds,
});

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
      for (const neighbor of [current - 24, current + 24, x ? current - 1 : -1, x < 23 ? current + 1 : -1]) {
        if (neighbor >= 0 && neighbor < 576 && pixels[neighbor] && !seen.has(neighbor)) {
          seen.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
  return count;
}

function mirrorPixels(pixels) {
  const result = new Array(576).fill(null);
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    result[(y * 24) + (23 - x)] = pixels[(y * 24) + x];
  }
  return result;
}

function countColors(pixels, colors) {
  return pixels.reduce((sum, color) => sum + (colors.has(color) ? 1 : 0), 0);
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

function rejects(action, label) {
  try {
    action();
    errors.push(`${label} must reject`);
  } catch (error) {
    check(String(error.message).includes('is not implemented'), `${label} rejected unexpectedly: ${error.message}`);
  }
}

check(
  EN_E08_CROWNMAW_GREATBLADE_GATE.status === 'implemented-awaiting-visual-approval'
    && EN_E08_CROWNMAW_GREATBLADE_GATE.approvedOn === null
    && EN_E08_CROWNMAW_GREATBLADE_GATE.approvalEvidence === null
    && EN_E08_CROWNMAW_GREATBLADE_GATE.approvedImplementation === null
    && EN_E08_CROWNMAW_GREATBLADE_GATE.publishedImplementation === null
    && EN_E08_CROWNMAW_GREATBLADE_GATE.publishedApprovalRecord === null
    && EN_E08_CROWNMAW_GREATBLADE_GATE.initialPublishedHandoff === null
    && EN_E08_CROWNMAW_GREATBLADE_GATE.publicationState === 'not-approved'
    && EN_E08_CROWNMAW_GREATBLADE_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve'),
  'Crownmaw Greatblade approval state or bounded publication authorization drifted',
);
check(
  EN_E08_CROWNMAW_GREATBLADE_GATE.baseCheckpoint === '7bdb09e95d47c6213e2387124c305f78b0b486d1'
    && EN_E08_CROWNMAW_GREATBLADE_GATE.authorizationEvidence.includes('designer replied: approved lets do next')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.authorizationEvidence.includes('Vowcoil completed the specialist role')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.authorizationEvidence.includes('only one private elite Living Weapon Crownmaw Greatblade'),
  'Crownmaw Greatblade authorization or base checkpoint drifted',
);
check(
  EN_E08_CROWNMAW_GREATBLADE_GATE.precedingApproval.gateId === EN_E08_VOWCOIL_GLAIVE_GATE.id
    && EN_E08_CROWNMAW_GREATBLADE_GATE.precedingApproval.candidateFrameDigest === EN_E08_VOWCOIL_GLAIVE_GATE.candidateFrameDigest
    && EN_E08_CROWNMAW_GREATBLADE_GATE.precedingApproval.publishedImplementation === EN_E08_VOWCOIL_GLAIVE_GATE.publishedImplementation
    && EN_E08_CROWNMAW_GREATBLADE_GATE.precedingApproval.publishedApprovalRecord === EN_E08_VOWCOIL_GLAIVE_GATE.publishedApprovalRecord
    && EN_E08_CROWNMAW_GREATBLADE_GATE.precedingApproval.initialPublishedHandoff === EN_E08_VOWCOIL_GLAIVE_GATE.initialPublishedHandoff
    && EN_E08_CROWNMAW_GREATBLADE_GATE.precedingApproval.currentReconciliation === '7bdb09e95d47c6213e2387124c305f78b0b486d1'
    && EN_E08_CROWNMAW_GREATBLADE_GATE.precedingApproval.reconciliationPublication === 'published',
  'Vowcoil Glaive predecessor publication tuple drifted',
);
check(
  EN_E08_CROWNMAW_GREATBLADE_GATE.scope.includes('complete 80-frame Crownmaw Greatblade elite Living Weapon')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.animationContract.includes('Death aliases Hurt H1,H2,H2,H2'),
  'Crownmaw Greatblade full-suite contract drifted',
);
check(
  EN_E08_CROWNMAW_GREATBLADE_GATE.exclusions.includes('public Living Weapon registration')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.exclusions.includes('asset-pack fixture generation or regeneration')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.exclusions.includes('wielders')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.exclusions.includes('detached or swapped blades')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.exclusions.includes('changes to approved Vowcoil Glaive rendered pixels')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.exclusions.includes('EN-E09 and later work'),
  'Crownmaw Greatblade exclusions drifted',
);
check(
  EN_E08_CROWNMAW_GREATBLADE_GATE.nextGate.includes('explicit visual approval or rejection')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.nextGate.includes('five frozen review hashes')
    && EN_E08_CROWNMAW_GREATBLADE_GATE.nextGate.includes('Do not commit, publish, register'),
  'Crownmaw Greatblade stop gate drifted',
);
check(
  Object.isFrozen(EN_E08_CROWNMAW_GREATBLADE_GATE)
    && Object.isFrozen(EN_E08_CROWNMAW_GREATBLADE_DATA)
    && Object.isFrozen(EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD)
    && Object.isFrozen(EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION),
  'Crownmaw Greatblade gate, data, and family card must be deeply immutable',
);
check(
  EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.status === 'selected'
    && EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected === 'baked-single-actor'
    && EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selectedOn === '2026-08-11'
    && EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.baseCheckpoint === '6f2a51739a65b88f8c50644e92e440c8004cc049'
    && EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selectionEvidence.includes('designer replied: awesome lets do next')
    && EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.childAssets.length === 0
    && EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.forbidden.includes('runtime attachment offsets')
    && EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.forbidden.includes('schema changes')
    && EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.reopenRule.includes('new explicit architecture gate'),
  'Living Weapon topology decision drifted',
);
check(
  JSON.stringify(EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.activeVariant.id === 'crownmaw-greatblade'
    && EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.precedingVariant.id === 'vowcoil-glaive'
    && EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.precedingVariant.status === 'approved-published'
    && EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.activeVariant.status === 'implemented-full-awaiting-visual-approval'
    && EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.actorTopology === 'baked-single-actor'
    && EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.deferredRoles.length === 0,
  'Living Weapon role order or one-active-role boundary drifted',
);
check(
  EN_E08_CROWNMAW_GREATBLADE_CONTRACT.silhouette.includes('broad symmetrical hovering execution greatblade')
    && EN_E08_CROWNMAW_GREATBLADE_CONTRACT.silhouette.includes('three crown prongs')
    && EN_E08_CROWNMAW_GREATBLADE_CONTRACT.silhouette.includes('toothed jaw guard')
    && EN_E08_CROWNMAW_GREATBLADE_CONTRACT.silhouette.includes('forked pommel')
    && EN_E08_CROWNMAW_GREATBLADE_DATA.actorTopology === 'baked-single-actor'
    && EN_E08_CROWNMAW_GREATBLADE_DATA.childAssets.length === 0
    && EN_E08_CROWNMAW_GREATBLADE_DATA.bakedEffects.length === 0,
  'Crownmaw Greatblade silhouette or external-effects firewall drifted',
);
check(
  ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E08')?.gate === 'architecture-gated',
  'isolated Crownmaw Greatblade candidate must not advance the EN-E08 ledger',
);
check(
  EN_E08_CROWNMAW_GREATBLADE_REGISTRY.families.length === 1
    && EN_E08_CROWNMAW_GREATBLADE_REGISTRY.publicFamilies.length === 0
    && EN_E08_CROWNMAW_GREATBLADE_FAMILY.variants.length === 1,
  'Crownmaw Greatblade isolated registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'living-weapon'),
  'Crownmaw Greatblade must preserve public 80/259 and remain private',
);
check(engine.EN_E08_CROWNMAW_GREATBLADE_REGISTRY === undefined, 'Crownmaw Greatblade must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(
  !publicSource.includes('enemy-expansion-en-e08-living-weapon-crownmaw-greatblade')
    && !facadeSource.includes('enemy-expansion-en-e08-living-weapon-crownmaw-greatblade')
    && !manifestSource.includes('crownmaw-greatblade'),
  'Crownmaw Greatblade public or fixture firewall drifted',
);

const captures = new Map();
const candidateRecords = [];
const fallenKnightRecords = [];
const crownvaultCastellanRecords = [];
const oathbiteCleaverRecords = [];
const vowcoilGlaiveRecords = [];
const paletteSets = ['blade', 'gold', 'binding'].map((name) => [
  name,
  new Set(EN_E08_CROWNMAW_GREATBLADE_DATA.crownmawGreatblade[name]),
]);
let connected = 0;
let bounded = 0;
let hovering = 0;
let colored = 0;
let flashes = 0;
let coreFrames = 0;
let fallenKnightDifferences = 0;
let fallenKnightAlphaDifferences = 0;
let crownvaultCastellanDifferences = 0;
let crownvaultCastellanAlphaDifferences = 0;
let oathbiteCleaverDifferences = 0;
let oathbiteCleaverAlphaDifferences = 0;
let vowcoilGlaiveDifferences = 0;
let vowcoilGlaiveAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;
let minOpaque = Infinity;
let maxOpaque = 0;

for (const animation of animations) for (const direction of directions) {
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = frameKey(direction, animation.id, frame);
    const candidate = captureEnemyExpansionFrame(
      EN_E08_CROWNMAW_GREATBLADE_REGISTRY,
      candidateSpec,
      direction,
      animation.id,
      frame,
    );
    const fallenKnight = captureEnemyExpansionFrame(EN_E01_PUBLIC_REGISTRY, fallenKnightSpec, direction, animation.id, frame);
    const crownvaultCastellan = captureEnemyExpansionFrame(
      EN_E08_CROWNVAULT_CASTELLAN_REGISTRY,
      crownvaultCastellanSpec,
      direction,
      animation.id,
      frame,
    );
    const oathbiteCleaver = captureEnemyExpansionFrame(
      EN_E08_OATHBITE_CLEAVER_REGISTRY,
      oathbiteCleaverSpec,
      direction,
      animation.id,
      frame,
    );
    const vowcoilGlaive = captureEnemyExpansionFrame(
      EN_E08_VOWCOIL_GLAIVE_REGISTRY,
      vowcoilGlaiveSpec,
      direction,
      animation.id,
      frame,
    );
    captures.set(key, candidate);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    fallenKnightRecords.push(frameRecord(fallenKnight, fallenKnightSpec, direction, animation.id, frame));
    crownvaultCastellanRecords.push(frameRecord(crownvaultCastellan, crownvaultCastellanSpec, direction, animation.id, frame));
    oathbiteCleaverRecords.push(frameRecord(oathbiteCleaver, oathbiteCleaverSpec, direction, animation.id, frame));
    vowcoilGlaiveRecords.push(frameRecord(vowcoilGlaive, vowcoilGlaiveSpec, direction, animation.id, frame));

    check(
      candidate.outOfBoundsWrites.length === 0
        && candidate.alpha.every((value) => value === 0 || value === 255),
      `${key} must stay in-cell with hard alpha`,
    );
    const isBounded = candidate.bounds
      && candidate.bounds.minX >= 1
      && candidate.bounds.minY >= 1
      && candidate.bounds.maxX <= 22
      && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++;
    else check(false, `${key} lost one-cell margin (${JSON.stringify(candidate.bounds)})`);
    const isHovering = candidate.bounds && candidate.bounds.maxY >= 14 && candidate.bounds.maxY <= 22;
    if (isHovering) hovering++;
    else check(false, `${key} lost true hover clearance`);
    const componentCount = components(candidate.pixels);
    if (componentCount === 1) connected++;
    else check(false, `${key} has ${componentCount} opaque components`);
    check(
      candidate.opaquePixels >= 95 && candidate.opaquePixels <= 230,
      `${key} density ${candidate.opaquePixels} is implausible for a broad hovering greatblade`,
    );
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    if (JSON.stringify(candidate.pixels) !== JSON.stringify(fallenKnight.pixels)) fallenKnightDifferences++;
    if (candidate.alphaDigest !== fallenKnight.alphaDigest) fallenKnightAlphaDifferences++;
    if (JSON.stringify(candidate.pixels) !== JSON.stringify(crownvaultCastellan.pixels)) crownvaultCastellanDifferences++;
    if (candidate.alphaDigest !== crownvaultCastellan.alphaDigest) crownvaultCastellanAlphaDifferences++;
    if (JSON.stringify(candidate.pixels) !== JSON.stringify(oathbiteCleaver.pixels)) oathbiteCleaverDifferences++;
    if (candidate.alphaDigest !== oathbiteCleaver.alphaDigest) oathbiteCleaverAlphaDifferences++;
    if (JSON.stringify(candidate.pixels) !== JSON.stringify(vowcoilGlaive.pixels)) vowcoilGlaiveDifferences++;
    if (candidate.alphaDigest !== vowcoilGlaive.alphaDigest) vowcoilGlaiveAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be an exact whole-actor white flash`);
      flashes++;
    } else {
      for (const [name, colors] of paletteSets) {
        check(countColors(candidate.pixels, colors) > 0, `${key} lost ${name} palette identity`);
      }
      const voidCount = countColors(candidate.pixels, new Set(EN_E08_CROWNMAW_GREATBLADE_DATA.crownmawGreatblade.void));
      const coreCount = countColors(candidate.pixels, new Set([EN_E08_CROWNMAW_GREATBLADE_DATA.crownmawGreatblade.core]));
      if (direction === 'up') {
        check(coreCount === 0, `${key} rear view must not expose the front core`);
      }
      else {
        check(coreCount >= 2 && coreCount <= 4, `${key} must expose one readable two-to-four-pixel slit core, found ${coreCount}`);
        check(voidCount >= 4, `${key} lost inset-core recess readability`);
        if (coreCount >= 2 && coreCount <= 4) coreFrames++;
      }
      colored++;
    }

    check(
      candidate.renderResult.crownmawGreatbladeGate === EN_E08_CROWNMAW_GREATBLADE_GATE.id
        && candidate.renderResult.actorTopology === 'baked-single-actor'
        && candidate.renderResult.childAssetCount === 0
        && candidate.renderResult.approvedPrecedingGate === EN_E08_VOWCOIL_GLAIVE_GATE.id,
      `${key} gate metadata drifted`,
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E08_CROWNMAW_GREATBLADE_DATA);
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
    `side mirror drifted ${animation.id}/${frame}`,
  );
  const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
  if (!flash) {
    check(
      captures.get(frameKey('down', animation.id, frame)).digest
        !== captures.get(frameKey('up', animation.id, frame)).digest,
      `Down/Up face treatment must differ ${animation.id}/${frame}`,
    );
  }
}

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame++) {
    check(
      JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels)
        === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels),
      `${direction} Cast alias drifted C${frame + 1}`,
    );
    const source = EN_E08_CROWNMAW_GREATBLADE_DEATH_SOURCE_FRAMES[frame];
    check(
      JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels)
        === JSON.stringify(captures.get(frameKey(direction, 'hurt', source)).pixels),
      `${direction} Death alias drifted D${frame + 1}`,
    );
  }
  check(
    new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2,
    `${direction} Idle must have two distinct frames`,
  );
  check(
    new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4,
    `${direction} Walk must have four distinct frames`,
  );
  check(
    new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4,
    `${direction} Attack must have four distinct frames`,
  );
}

const candidateDigest = hashJson(candidateRecords);
const fallenKnightDigest = hashJson(fallenKnightRecords);
const crownvaultCastellanDigest = hashJson(crownvaultCastellanRecords);
const oathbiteCleaverDigest = hashJson(oathbiteCleaverRecords);
const vowcoilGlaiveDigest = hashJson(vowcoilGlaiveRecords);
if (EN_E08_CROWNMAW_GREATBLADE_GATE.candidateFrameDigest) {
  check(candidateDigest === EN_E08_CROWNMAW_GREATBLADE_GATE.candidateFrameDigest, 'Crownmaw Greatblade candidate digest drifted');
}
if (EN_E08_CROWNMAW_GREATBLADE_GATE.fallenKnightComparisonDigest) {
  check(fallenKnightDigest === EN_E08_CROWNMAW_GREATBLADE_GATE.fallenKnightComparisonDigest, 'Fallen Knight comparison digest drifted');
}
if (EN_E08_CROWNMAW_GREATBLADE_GATE.crownvaultCastellanComparisonDigest) {
  check(crownvaultCastellanDigest === EN_E08_CROWNMAW_GREATBLADE_GATE.crownvaultCastellanComparisonDigest, 'Crownvault Castellan comparison digest drifted');
}
if (EN_E08_CROWNMAW_GREATBLADE_GATE.oathbiteCleaverComparisonDigest) {
  check(oathbiteCleaverDigest === EN_E08_CROWNMAW_GREATBLADE_GATE.oathbiteCleaverComparisonDigest, 'Oathbite Cleaver comparison digest drifted');
}
if (EN_E08_CROWNMAW_GREATBLADE_GATE.vowcoilGlaiveComparisonDigest) {
  check(vowcoilGlaiveDigest === EN_E08_CROWNMAW_GREATBLADE_GATE.vowcoilGlaiveComparisonDigest, 'Vowcoil Glaive comparison digest drifted');
}

check(
  vowcoilGlaiveDigest === EN_E08_VOWCOIL_GLAIVE_GATE.candidateFrameDigest
    && vowcoilGlaiveDigest === EN_E08_CROWNMAW_GREATBLADE_GATE.vowcoilGlaiveComparisonDigest,
  'approved Vowcoil Glaive predecessor pixels drifted',
);
check(
  oathbiteCleaverDigest === EN_E08_OATHBITE_CLEAVER_GATE.candidateFrameDigest
    && oathbiteCleaverDigest === EN_E08_CROWNMAW_GREATBLADE_GATE.oathbiteCleaverComparisonDigest,
  'approved Oathbite Cleaver predecessor pixels drifted',
);
check(
  crownvaultCastellanDigest === EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest
    && crownvaultCastellanDigest === EN_E08_CROWNMAW_GREATBLADE_GATE.crownvaultCastellanComparisonDigest,
  'approved Crownvault Castellan comparison pixels drifted',
);

check(
  fallenKnightDifferences === 80
    && fallenKnightAlphaDifferences === 80
    && crownvaultCastellanDifferences === 80
    && crownvaultCastellanAlphaDifferences === 80
    && oathbiteCleaverDifferences === 80
    && oathbiteCleaverAlphaDifferences === 80
    && vowcoilGlaiveDifferences === 80
    && vowcoilGlaiveAlphaDifferences === 80
    && connected === 80
    && bounded === 80
    && hovering === 80
    && colored === 72
    && flashes === 8
    && coreFrames === 54,
  'suite totals drifted: Fallen Knight '
    + `${fallenKnightDifferences}/80 pixels ${fallenKnightAlphaDifferences}/80 alpha; Crownvault `
    + `${crownvaultCastellanDifferences}/80 pixels ${crownvaultCastellanAlphaDifferences}/80 alpha; Oathbite `
    + `${oathbiteCleaverDifferences}/80 pixels ${oathbiteCleaverAlphaDifferences}/80 alpha; structure `
    + `Vowcoil ${vowcoilGlaiveDifferences}/80 pixels ${vowcoilGlaiveAlphaDifferences}/80 alpha; structure `
    + `${connected}/${bounded}/${hovering}; identity ${colored}/72 colored ${flashes}/8 flashes ${coreFrames}/54 cores`,
);
check(completeB > 0 && formChanges > 0, 'Complete B/Form presentation must change pixels');

const artifacts = [
  [EN_E08_CROWNMAW_GREATBLADE_GATE.artifact, EN_E08_CROWNMAW_GREATBLADE_GATE.artifactSha256],
  [EN_E08_CROWNMAW_GREATBLADE_GATE.assembledArtifact, EN_E08_CROWNMAW_GREATBLADE_GATE.assembledArtifactSha256],
  [EN_E08_CROWNMAW_GREATBLADE_GATE.comparisonArtifact, EN_E08_CROWNMAW_GREATBLADE_GATE.comparisonArtifactSha256],
  [EN_E08_CROWNMAW_GREATBLADE_GATE.reviewAnimations.raw.artifact, EN_E08_CROWNMAW_GREATBLADE_GATE.reviewAnimations.raw.sha256],
  [EN_E08_CROWNMAW_GREATBLADE_GATE.reviewAnimations.completeBForm.artifact, EN_E08_CROWNMAW_GREATBLADE_GATE.reviewAnimations.completeBForm.sha256],
];
for (const [artifact, expected] of artifacts) {
  if (expected) check(await sha256File(artifact) === expected, `${artifact} hash drifted`);
}

for (const family of ['animated-armor', 'headless-rider', 'living-weapon', 'living-shadow']) {
  rejects(
    () => engine.renderEnemyExpansionFrame(
      EN_E08_CROWNMAW_GREATBLADE_REGISTRY,
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
  console.error('EN-E08 Living Weapon Crownmaw Greatblade focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E08 Living Weapon Crownmaw Greatblade focused gate passed.');
console.log(`- Fallen Knight distinction: ${fallenKnightDifferences}/80 pixel frames and ${fallenKnightAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Crownvault Castellan distinction: ${crownvaultCastellanDifferences}/80 pixel frames and ${crownvaultCastellanAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Oathbite Cleaver distinction: ${oathbiteCleaverDifferences}/80 pixel frames and ${oathbiteCleaverAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Vowcoil Glaive distinction: ${vowcoilGlaiveDifferences}/80 pixel frames and ${vowcoilGlaiveAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connected}/80 connected; ${bounded}/80 bounded; ${hovering}/80 hovering; opaque range ${minOpaque}-${maxOpaque}`);
console.log(`- Style identity: ${colored}/72 colored palette frames; ${flashes}/8 exact white flashes; ${coreFrames}/54 readable core views`);
console.log(`- Presentation: Complete B +${completeB}; Form changes ${formChanges}`);
console.log('- Protected: approved Vowcoil Glaive, Oathbite Cleaver, and Crownvault Castellan exact; public 80/259; fixtures unchanged');
console.log(`- Candidate digest: ${candidateDigest}`);
console.log(`- Public Fallen Knight Shieldbearer frame digest: ${fallenKnightDigest}`);
console.log(`- Approved Crownvault Castellan frame digest: ${crownvaultCastellanDigest}`);
console.log(`- Approved Oathbite Cleaver frame digest: ${oathbiteCleaverDigest}`);
console.log(`- Approved Vowcoil Glaive frame digest: ${vowcoilGlaiveDigest}`);
