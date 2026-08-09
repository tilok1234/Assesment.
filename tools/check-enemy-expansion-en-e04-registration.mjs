import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY,
} from '../engine/enemy-expansion-repairs.js';
import {
  EN_E04_APPROVED_FAMILIES,
  EN_E04_PUBLIC_REGISTRY,
  EN_E04_REGISTRATION_GATE,
} from '../engine/enemy-expansion-en-e04.js';
import {
  EN_E04_NAGA_MOTION_GATE,
  EN_E04_NAGA_MOTION_REGISTRY,
} from '../engine/enemy-expansion-en-e04-naga-motion.js';
import {
  EN_E04_NAGA_EXPANDED_SLICE_GATE,
  EN_E04_NAGA_EXPANDED_SLICE_REGISTRY,
} from '../engine/enemy-expansion-en-e04-venom-motion-rajah-idle.js';
import {
  EN_E04_TEMPLE_RAJAH_MOTION_GATE,
  EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY,
} from '../engine/enemy-expansion-en-e04-rajah-motion.js';
import {
  EN_E04_MERFOLK_TIDEGUARD_GATE,
  EN_E04_MERFOLK_TIDEGUARD_REGISTRY,
} from '../engine/enemy-expansion-en-e04-merfolk-tideguard.js';
import {
  EN_E04_MERFOLK_REEFCALLER_GATE,
  EN_E04_MERFOLK_REEFCALLER_REGISTRY,
} from '../engine/enemy-expansion-en-e04-merfolk-reefcaller.js';
import {
  EN_E04_MERFOLK_PEARL_REGENT_GATE,
  EN_E04_MERFOLK_PEARL_REGENT_REGISTRY,
} from '../engine/enemy-expansion-en-e04-merfolk-pearl-regent.js';
import {
  EN_E04_BIRDFOLK_AERIE_SCOUT_GATE,
  EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY,
} from '../engine/enemy-expansion-en-e04-birdfolk-aerie-scout.js';
import {
  EN_E04_BIRDFOLK_GALE_AUGUR_GATE,
  EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY,
} from '../engine/enemy-expansion-en-e04-birdfolk-gale-augur.js';
import {
  EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE,
  EN_E04_BIRDFOLK_STORMCROWN_EXARCH_REGISTRY,
} from '../engine/enemy-expansion-en-e04-birdfolk-stormcrown-exarch.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

const sourceEntries = [
  { family: 'naga', variant: 'coilguard', registry: EN_E04_NAGA_MOTION_REGISTRY, gate: EN_E04_NAGA_MOTION_GATE },
  { family: 'naga', variant: 'venom-oracle', registry: EN_E04_NAGA_EXPANDED_SLICE_REGISTRY, gate: EN_E04_NAGA_EXPANDED_SLICE_GATE },
  { family: 'naga', variant: 'temple-rajah', registry: EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY, gate: EN_E04_TEMPLE_RAJAH_MOTION_GATE },
  { family: 'merfolk', variant: 'tideguard', registry: EN_E04_MERFOLK_TIDEGUARD_REGISTRY, gate: EN_E04_MERFOLK_TIDEGUARD_GATE },
  { family: 'merfolk', variant: 'reefcaller', registry: EN_E04_MERFOLK_REEFCALLER_REGISTRY, gate: EN_E04_MERFOLK_REEFCALLER_GATE },
  { family: 'merfolk', variant: 'pearl-regent', registry: EN_E04_MERFOLK_PEARL_REGENT_REGISTRY, gate: EN_E04_MERFOLK_PEARL_REGENT_GATE },
  { family: 'birdfolk', variant: 'aerie-scout', registry: EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY, gate: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE },
  { family: 'birdfolk', variant: 'gale-augur', registry: EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY, gate: EN_E04_BIRDFOLK_GALE_AUGUR_GATE },
  { family: 'birdfolk', variant: 'stormcrown-exarch', registry: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_REGISTRY, gate: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE },
];

const expectedVariants = {
  birdfolk: ['aerie-scout', 'gale-augur', 'stormcrown-exarch'],
  merfolk: ['tideguard', 'reefcaller', 'pearl-regent'],
  naga: ['coilguard', 'venom-oracle', 'temple-rajah'],
};

check(EN_E04_REGISTRATION_GATE.status === 'approved', 'EN-E04 registration must retain explicit designer approval');
check(EN_E04_REGISTRATION_GATE.authorizedOn === '2026-08-09', 'EN-E04 registration authorization date drifted');
check(EN_E04_REGISTRATION_GATE.approvalEvidence.includes('sure lets do 123'), 'EN-E04 registration approval evidence drifted');
check(EN_E04_REGISTRATION_GATE.sourceCheckpoint === '6f81c92', 'EN-E04 registration must identify the published Stormcrown handoff');
check(Object.isFrozen(EN_E04_REGISTRATION_GATE), 'EN-E04 registration evidence must be immutable');

check(sourceEntries.length === 9, 'EN-E04 registration needs exactly nine approved source enemies');
for (const entry of sourceEntries) {
  check(entry.gate.status === 'approved', `${entry.family}/${entry.variant} must retain explicit visual approval`);
  check(entry.registry.publicFamilies.length === 0, `${entry.family}/${entry.variant} source evidence must remain internal and non-public`);
}

check(EN_E04_APPROVED_FAMILIES.length === 3, 'EN-E04 registration needs exactly three approved families');
check(JSON.stringify(EN_E04_PUBLIC_REGISTRY.families.map((family) => family.id)) === JSON.stringify(['birdfolk', 'merfolk', 'naga']), 'EN-E04 registered family order must be deterministic');
check(EN_E04_PUBLIC_REGISTRY.renderers.length === 3, 'EN-E04 registration needs one bounded dispatcher per family');
check(EN_E04_PUBLIC_REGISTRY.families.every((family) => family.state === engine.ENEMY_EXPANSION_STATES.APPROVED), 'all registered EN-E04 families must be approved');
check(EN_E04_PUBLIC_REGISTRY.approvedFamilies.length === 3 && EN_E04_PUBLIC_REGISTRY.publicFamilies.length === 3, 'all three EN-E04 families must enter the stable registry public view');
check(Object.isFrozen(EN_E04_PUBLIC_REGISTRY), 'the EN-E04 registered slice must be immutable');

for (const family of EN_E04_PUBLIC_REGISTRY.families) {
  const publicFamily = EN_E04_PUBLIC_REGISTRY.publicFamilies.find((entry) => entry.id === family.id);
  check(JSON.stringify(family.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[family.id]), `${family.id} registered variants must remain common/specialist/elite`);
  check(JSON.stringify(publicFamily?.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[family.id]), `${family.id} public registry variants drifted`);
  check(publicFamily?.variants.every((variant) => !Object.hasOwn(variant, 'brief')), `${family.id} public variants must omit internal briefs`);
  check(family.variants.every((variant) => variant.rendererData?.actor), `${family.id} registered variants need complete actor renderer data`);
}

const stableFamilyIds = engine.ENEMY_EXPANSION_REGISTRY.families.map((family) => family.id);
check(engine.ENEMY_EXPANSION_REGISTRY.families.length === 23, 'the approved backlog integration must extend the stable registry to twenty-three approved families');
check(engine.ENEMY_EXPANSION_REGISTRY.publicFamilies.length === 23, 'the stable registry must expose twenty-three approved family records');
check(engine.ENEMY_EXPANSION_REGISTRY.renderers.length === 14, 'the stable registry must contain fourteen bounded family renderers');
check(['birdfolk', 'merfolk', 'naga'].every((id) => stableFamilyIds.includes(id)), 'the stable registry is missing an approved EN-E04 family');
check(Object.isFrozen(engine.ENEMY_EXPANSION_REGISTRY), 'the composed stable registry must be immutable');

check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'the later EN-E05 consumer gate must reuse the exact stable registry');
check(engine.ENEMY_EXPANSION_REGISTRY !== ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY, 'EN-E04 registration must remain composed above the unchanged approved EN-E01/EN-E02 repair registry');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies.length === 23, 'consumer routing must contain all twenty-three approved families');
const publicVariants = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
check(engine.PUBLIC_ENEMIES.length === 80 && publicVariants === 259, 'the approved backlog integration must expose the 80-family / 259-variant catalog');
check(['birdfolk', 'merfolk', 'naga'].every((id) => engine.PUBLIC_ENEMIES.some((family) => family.id === id)), 'the later consumer gate must expose every registered EN-E04 family');
check(sourceEntries.every((entry) => engine.isPublicEnemyExpansionSpec({ kind: 'enemy', family: entry.family, variant: entry.variant })), 'the later consumer gate must route every EN-E04 enemy through the public dispatcher');
check(engine.ENEMIES.length === 57, 'EN-E04 registration must not rewrite the legacy 57-family catalog');

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(facadeSource.includes("from './engine/enemy-expansion-public.js'"), 'the public facade must retain the stable expansion boundary');
check(!facadeSource.includes('enemy-expansion-en-e04') && !facadeSource.includes('EN_E04_'), 'the public facade must not expose EN-E04 implementation details directly');

const ledgerReport = engine.buildEnemyExpansionLedgerReport();
check(ledgerReport.counts.slices === 22 && ledgerReport.counts.proposals === 80, 'EN-E04 registration must preserve the 22-slice / 80-proposal ledger');
check(ledgerReport.counts.approved === 7 && ledgerReport.counts.implemented === 0 && ledgerReport.counts.planned === 15, 'the approved backlog integration must advance ledger lifecycle counts to seven approved and fifteen planned slices');
check(ledgerReport.counts.registeredFamilies === 23 && ledgerReport.counts.publicFamilies === 23, 'the stable registry must report twenty-three registered/public family records');
const enE04Slice = ledgerReport.slices.find((slice) => slice.id === 'EN-E04');
check(enE04Slice?.state === engine.ENEMY_EXPANSION_STATES.APPROVED, 'EN-E04 ledger state must be approved');
check(enE04Slice?.gate === 'nine-enemy-registration-approved-2026-08-09', 'EN-E04 ledger gate drifted');
check(enE04Slice?.registeredFamilies === 3 && enE04Slice?.publicFamilies === 3, 'EN-E04 ledger row must report three registered families');
check(ledgerReport.slices.filter((slice) => slice.publicFamilies > 0).every((slice) => ['EN-E01', 'EN-E02', 'EN-E03', 'EN-E04', 'EN-E05', 'EN-E06'].includes(slice.id)), 'no unapproved expansion slice may become registered implicitly');

const frameRecords = [];
let sheets = 0;
for (const entry of sourceEntries) {
  const spec = { kind: 'enemy', family: entry.family, variant: entry.variant };
  const sheetFrames = [];
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const candidate = captureEnemyExpansionFrame(entry.registry, spec, direction, animation.id, frame, engine.SIZE);
      const registered = captureEnemyExpansionFrame(EN_E04_PUBLIC_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
      const prefix = `${entry.family}/${entry.variant}/${direction}/${animation.id}/${frame}`;
      check(registered.digest === candidate.digest, `${prefix} registered pixels differ from the approved candidate`);
      check(registered.alphaDigest === candidate.alphaDigest, `${prefix} registered alpha differs from the approved candidate`);
      check(registered.outOfBoundsWrites.length === 0, `${prefix} registered rendering attempted an out-of-bounds write`);
      frameRecords.push({
        family: entry.family,
        variant: entry.variant,
        direction,
        animation: animation.id,
        frame,
        digest: registered.digest,
        alphaDigest: registered.alphaDigest,
        opaquePixels: registered.opaquePixels,
        bounds: registered.bounds,
      });
      sheetFrames.push({
        direction,
        animation: animation.id,
        frame,
        alpha: registered.alpha,
        outOfBoundsWrites: registered.outOfBoundsWrites,
      });
    }
  }
  const sheet = engine.validateEnemyExpansionSheet({
    width: engine.ENEMY_EXPANSION_PROFILE.frameContract.width,
    height: engine.ENEMY_EXPANSION_PROFILE.frameContract.height,
    directions: [...engine.DIRS],
    frames: sheetFrames,
  });
  check(sheet.valid && sheet.frames === 80 && sheet.binaryAlpha, `${entry.family}/${entry.variant} registered sheet must satisfy the complete 80-frame contract`);
  sheets++;
}

check(frameRecords.length === 720, 'EN-E04 registration must verify all 720 approved frames');
check(sheets === 9, 'EN-E04 registration must verify nine complete sheets');
const registeredFrameDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(registeredFrameDigest === EN_E04_REGISTRATION_GATE.candidateFrameDigest, 'registered EN-E04 aggregate digest differs from the frozen candidate digest');

if (errors.length) {
  console.error('EN-E04 registration validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  console.error(`- Computed EN-E04 registered frame digest: ${registeredFrameDigest}`);
  process.exit(1);
}

console.log('EN-E04 registration validation passed.');
console.log('- EN-E04 registered slice: 3 families / 9 variants; later stable registry: 17 families / 43 variants');
console.log('- Registered EN-E04 sheets: 9 (480x96)');
console.log('- Candidate/registered parity frames: 720');
console.log('- Consumer catalog after approved backlog integration: 80 families / 259 variants');
console.log(`- Approved EN-E04 aggregate digest: ${registeredFrameDigest}`);
