import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { renderSpritePixels } from '../engine/pixel-buffer.js';
import {
  EN_E05_APPROVED_FAMILIES,
  EN_E05_GHOUL_REGISTERED_REPLACEMENT_FAMILY,
  EN_E05_GHOUL_REPLACEMENT_REGISTRY,
  EN_E05_PUBLIC_REGISTRY,
  EN_E05_REGISTRATION_GATE,
} from '../engine/enemy-expansion-en-e05.js';
import {
  EN_E05_GHOUL_UPGRADE_GATE,
  EN_E05_GHOUL_UPGRADE_REGISTRY,
} from '../engine/enemy-expansion-en-e05-ghoul-upgrade.js';
import {
  EN_E05_MUMMY_GATE,
  EN_E05_MUMMY_REGISTRY,
} from '../engine/enemy-expansion-en-e05-mummy.js';
import {
  EN_E05_VAMPIRE_GATE,
  EN_E05_VAMPIRE_REGISTRY,
} from '../engine/enemy-expansion-en-e05-vampire.js';
import {
  EN_E05_REVENANT_GATE,
  EN_E05_REVENANT_REGISTRY,
} from '../engine/enemy-expansion-en-e05-revenant.js';
import {
  EN_E05_LICH_GATE,
  EN_E05_LICH_REGISTRY,
} from '../engine/enemy-expansion-en-e05-lich.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.resolve(root, relativePath))).digest('hex');
}

const sourceEntries = [
  {
    kind: 'replacement',
    sourceSpec: { kind: 'enemy', family: 'ghoul-upgrade', variant: 'ghoul' },
    registeredSpec: { kind: 'enemy', family: 'ghoul-upgrade', variant: 'ghoul' },
    target: { family: 'zombie', variant: 'ghoul' },
    sourceRegistry: EN_E05_GHOUL_UPGRADE_REGISTRY,
    registeredRegistry: EN_E05_GHOUL_REPLACEMENT_REGISTRY,
    gate: EN_E05_GHOUL_UPGRADE_GATE,
    approvalKey: 'ghoulUpgrade',
  },
  {
    kind: 'family',
    sourceSpec: { kind: 'enemy', family: 'mummy', variant: 'tomb-walker' },
    registeredSpec: { kind: 'enemy', family: 'mummy', variant: 'tomb-walker' },
    sourceRegistry: EN_E05_MUMMY_REGISTRY,
    registeredRegistry: EN_E05_PUBLIC_REGISTRY,
    gate: EN_E05_MUMMY_GATE,
    approvalKey: 'mummy',
  },
  {
    kind: 'family',
    sourceSpec: { kind: 'enemy', family: 'vampire', variant: 'night-noble' },
    registeredSpec: { kind: 'enemy', family: 'vampire', variant: 'night-noble' },
    sourceRegistry: EN_E05_VAMPIRE_REGISTRY,
    registeredRegistry: EN_E05_PUBLIC_REGISTRY,
    gate: EN_E05_VAMPIRE_GATE,
    approvalKey: 'vampire',
  },
  {
    kind: 'family',
    sourceSpec: { kind: 'enemy', family: 'revenant', variant: 'grave-oathkeeper' },
    registeredSpec: { kind: 'enemy', family: 'revenant', variant: 'grave-oathkeeper' },
    sourceRegistry: EN_E05_REVENANT_REGISTRY,
    registeredRegistry: EN_E05_PUBLIC_REGISTRY,
    gate: EN_E05_REVENANT_GATE,
    approvalKey: 'revenant',
  },
  {
    kind: 'family',
    sourceSpec: { kind: 'enemy', family: 'lich', variant: 'soul-regent' },
    registeredSpec: { kind: 'enemy', family: 'lich', variant: 'soul-regent' },
    sourceRegistry: EN_E05_LICH_REGISTRY,
    registeredRegistry: EN_E05_PUBLIC_REGISTRY,
    gate: EN_E05_LICH_GATE,
    approvalKey: 'lich',
  },
];

const expectedVariants = {
  lich: ['soul-regent'],
  mummy: ['tomb-walker'],
  revenant: ['grave-oathkeeper'],
  vampire: ['night-noble'],
};

check(EN_E05_REGISTRATION_GATE.id === 'en-e05-five-undead-registration-v1', 'EN-E05 registration gate id drifted');
check(EN_E05_REGISTRATION_GATE.status === 'authorized', 'EN-E05 registration must retain the explicit continuation authorization');
check(EN_E05_REGISTRATION_GATE.authorizedOn === '2026-08-09', 'EN-E05 registration authorization date drifted');
check(EN_E05_REGISTRATION_GATE.authorizationEvidence.includes('designer said: lets do next'), 'EN-E05 registration must retain the exact designer continuation evidence');
check(EN_E05_REGISTRATION_GATE.authorizationEvidence.includes('does not open consumer integration or Wave 2'), 'EN-E05 registration must remain bounded before later gates');
check(EN_E05_REGISTRATION_GATE.sourceCheckpoint === 'c0e438ba25de3f0adc063e6b294cba6c7b5182be', 'EN-E05 registration must identify the clean published Lich handoff');
check(EN_E05_REGISTRATION_GATE.scope.includes('four approved new EN-E05 families') && EN_E05_REGISTRATION_GATE.scope.includes('legacy zombie/ghoul replacement'), 'EN-E05 registration scope drifted');
check(EN_E05_REGISTRATION_GATE.exclusions.includes('assembler consumer exposure') && EN_E05_REGISTRATION_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E05_REGISTRATION_GATE.exclusions.includes('Wave 2'), 'EN-E05 registration must protect consumers, fixtures, and Wave 2');
check(Object.isFrozen(EN_E05_REGISTRATION_GATE) && Object.isFrozen(EN_E05_REGISTRATION_GATE.approvedSources), 'EN-E05 registration evidence must be deeply immutable');

check(sourceEntries.length === 5, 'EN-E05 registration needs exactly five approved source enemies');
for (const entry of sourceEntries) {
  const approval = EN_E05_REGISTRATION_GATE.approvedSources[entry.approvalKey];
  check(approval?.gateId === entry.gate.id, `${entry.approvalKey} source gate provenance drifted`);
  check(approval?.candidateFrameDigest === entry.gate.candidateFrameDigest, `${entry.approvalKey} approved digest provenance drifted`);
  check(entry.sourceRegistry.publicFamilies.length === 0, `${entry.sourceSpec.family}/${entry.sourceSpec.variant} source evidence must remain internal and non-public`);
}

check(EN_E05_APPROVED_FAMILIES.length === 4, 'EN-E05 stable registration needs exactly four new families');
check(JSON.stringify(EN_E05_PUBLIC_REGISTRY.families.map((family) => family.id)) === JSON.stringify(['lich', 'mummy', 'revenant', 'vampire']), 'EN-E05 registered family order must be deterministic');
check(EN_E05_PUBLIC_REGISTRY.renderers.length === 4, 'EN-E05 stable registration needs one bounded renderer per new family');
check(EN_E05_PUBLIC_REGISTRY.families.every((family) => family.state === engine.ENEMY_EXPANSION_STATES.APPROVED), 'all registered EN-E05 new families must be approved');
check(EN_E05_PUBLIC_REGISTRY.approvedFamilies.length === 4 && EN_E05_PUBLIC_REGISTRY.publicFamilies.length === 4, 'all four new EN-E05 families must enter the stable registry public view');
check(Object.isFrozen(EN_E05_PUBLIC_REGISTRY), 'the EN-E05 registered new-family slice must be immutable');

for (const family of EN_E05_PUBLIC_REGISTRY.families) {
  const stableFamily = engine.ENEMY_EXPANSION_REGISTRY.families.find((entry) => entry.id === family.id);
  const stablePublicFamily = engine.ENEMY_EXPANSION_REGISTRY.publicFamilies.find((entry) => entry.id === family.id);
  check(JSON.stringify(family.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[family.id]), `${family.id} registered variants drifted`);
  check(JSON.stringify(stableFamily?.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[family.id]), `${family.id} stable variants drifted`);
  check(JSON.stringify(stablePublicFamily?.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[family.id]), `${family.id} stable public view drifted`);
  check(stablePublicFamily?.variants.every((variant) => !Object.hasOwn(variant, 'brief')), `${family.id} stable public variants must omit internal briefs`);
  check(family.variants.every((variant) => variant.rendererData?.actor), `${family.id} registered variants need complete actor renderer data`);
}

check(EN_E05_GHOUL_REPLACEMENT_REGISTRY.families.length === 1 && EN_E05_GHOUL_REPLACEMENT_REGISTRY.renderers.length === 1, 'Ghoul replacement registration must remain one bounded family and renderer');
check(EN_E05_GHOUL_REGISTERED_REPLACEMENT_FAMILY.id === 'ghoul-upgrade', 'Ghoul replacement registration id drifted');
check(EN_E05_GHOUL_REPLACEMENT_REGISTRY.families[0].state === engine.ENEMY_EXPANSION_STATES.APPROVED, 'the registered Ghoul replacement must retain approved state');
check(EN_E05_GHOUL_REPLACEMENT_REGISTRY.families[0].variants.length === 1 && EN_E05_GHOUL_REPLACEMENT_REGISTRY.families[0].variants[0].id === 'ghoul', 'the registered Ghoul replacement must contain only Ghoul');
check(JSON.stringify(EN_E05_GHOUL_REGISTERED_REPLACEMENT_FAMILY.rendererData.replacementTarget) === JSON.stringify({ family: 'zombie', variant: 'ghoul' }), 'the registered Ghoul replacement target drifted');
check(!engine.ENEMY_EXPANSION_REGISTRY.families.some((family) => family.id === 'ghoul-upgrade'), 'the Ghoul replacement record must remain outside the new-family stable registry');

const stableVariantCount = engine.ENEMY_EXPANSION_REGISTRY.families.reduce((total, family) => total + family.variants.length, 0);
const consumerVariantCount = engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.families.reduce((total, family) => total + family.variants.length, 0);
const stableFamilyIds = engine.ENEMY_EXPANSION_REGISTRY.families.map((family) => family.id);
const consumerFamilyIds = engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.families.map((family) => family.id);
check(engine.ENEMY_EXPANSION_REGISTRY.families.length === 43 && stableVariantCount === 114, 'the stable registry must contain 43 families / 114 variants after approved backlog integration');
check(engine.ENEMY_EXPANSION_REGISTRY.publicFamilies.length === 43, 'the stable registry must expose 43 approved family records');
check(engine.ENEMY_EXPANSION_REGISTRY.renderers.length === 34, 'the stable registry must contain thirty-four bounded family renderers');
check(['lich', 'mummy', 'revenant', 'vampire'].every((id) => stableFamilyIds.includes(id)), 'the stable registry is missing an approved EN-E05 family');
check(Object.isFrozen(engine.ENEMY_EXPANSION_REGISTRY), 'the composed EN-E05 stable registry must be immutable');

check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'the later EN-E05 consumer gate must reuse the exact registered stable object');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.families.length === 43 && consumerVariantCount === 114, 'the assembler consumer registry must contain the complete 43/114 stable boundary');
check(['lich', 'mummy', 'revenant', 'vampire'].every((id) => consumerFamilyIds.includes(id)) && !consumerFamilyIds.includes('ghoul-upgrade'), 'the later consumer gate must expose only the four registered new families and keep the Ghoul replacement separate');
check(Object.isFrozen(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY), 'the authorized EN-E05 consumer registry must remain immutable');

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.ENEMIES.reduce((total, family) => total + family.variants.length, 0) === 202, 'EN-E05 registration must not rewrite the legacy 57/202 catalog');
check(engine.PUBLIC_ENEMIES.length === 100 && publicVariantCount === 316, 'the approved backlog integration must expose the public 100/316 catalog');
check(engine.PUBLIC_ENEMIES.slice(0, 57).every((family, index) => family === engine.ENEMIES[index]), 'EN-E05 registration must retain the exact legacy family records');
check(['lich', 'mummy', 'revenant', 'vampire'].every((id) => engine.PUBLIC_ENEMIES.some((family) => family.id === id)) && !engine.PUBLIC_ENEMIES.some((family) => family.id === 'ghoul-upgrade'), 'the later consumer gate must expose the four new families without exposing the Ghoul replacement record');
check(sourceEntries.filter((entry) => entry.kind === 'family').every((entry) => engine.isPublicEnemyExpansionSpec(entry.registeredSpec)), 'the later EN-E05 consumer gate must route all four new families through the public dispatcher');

const publicZombie = engine.PUBLIC_ENEMIES.find((family) => family.id === 'zombie');
const legacyZombie = engine.ENEMIES.find((family) => family.id === 'zombie');
check(publicZombie === legacyZombie, 'public Zombie must remain the exact legacy family record');
check(publicZombie?.variants.find((variant) => variant.id === 'ghoul') === legacyZombie?.variants.find((variant) => variant.id === 'ghoul'), 'public zombie/ghoul must remain the exact legacy variant record');
check(await sha256File('asset-pack/enemies/zombie-ghoul.png') === 'a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2', 'the frozen legacy Ghoul fixture changed');

const publicGhoulFrames = [];
for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
  for (let frame = 0; frame < animation.frames; frame++) {
    publicGhoulFrames.push(renderSpritePixels({ kind: 'enemy', family: 'zombie', variant: 'ghoul' }, direction, animation.id, frame, { shadow: false }));
  }
}
check(hashJson(publicGhoulFrames) === 'e555caccdc1b164a9271d7558df197b3999614107975fe533ab6359ddd95ae05', 'public zombie/ghoul must use the approved replacement pixels');

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
check(facadeSource.includes("from './engine/enemy-expansion-public.js'"), 'the public facade must retain the stable expansion boundary');
check(!facadeSource.includes('enemy-expansion-en-e05') && !facadeSource.includes('EN_E05_'), 'the public facade must not expose EN-E05 implementation details directly');
check(publicSource.includes("import { EN_E05_PUBLIC_REGISTRY } from './enemy-expansion-en-e05.js';"), 'the stable registry must import the bounded EN-E05 registration');
check(publicSource.indexOf('export const ENEMY_EXPANSION_REGISTRY') < publicSource.indexOf('export const ENEMY_EXPANSION_CONSUMER_REGISTRY'), 'the later consumer boundary must alias the completed EN-E05 stable layer');
check(publicSource.includes('export const ENEMY_EXPANSION_CONSUMER_REGISTRY = ENEMY_EXPANSION_REGISTRY;'), 'the later consumer boundary must reuse the exact stable registry');

const ledgerReport = engine.buildEnemyExpansionLedgerReport();
check(ledgerReport.counts.slices === 22 && ledgerReport.counts.proposals === 80, 'EN-E05 registration must preserve the 22-slice / 80-proposal ledger');
check(ledgerReport.counts.approved === 7 && ledgerReport.counts.implemented === 0 && ledgerReport.counts.planned === 15, 'ledger lifecycle counts must be seven approved and fifteen planned slices');
check(ledgerReport.counts.registeredFamilies === 43 && ledgerReport.counts.publicFamilies === 43, 'ledger must report forty-three stable registered/public families');
const enE05Slice = ledgerReport.slices.find((slice) => slice.id === 'EN-E05');
check(enE05Slice?.state === engine.ENEMY_EXPANSION_STATES.APPROVED, 'EN-E05 ledger state must be approved');
check(enE05Slice?.gate === 'five-undead-registration-authorized-2026-08-09', 'EN-E05 ledger gate drifted');
check(enE05Slice?.registeredFamilies === 4 && enE05Slice?.publicFamilies === 4, 'EN-E05 ledger row must report four new registered families; Ghoul remains a separate replacement record');
check(ledgerReport.slices.filter((slice) => slice.publicFamilies > 0).every((slice) => ['EN-E01', 'EN-E02', 'EN-E03', 'EN-E04', 'EN-E05', 'EN-E06', 'EN-E07', 'EN-E08', 'EN-E09', 'EN-E10', 'EN-E11'].includes(slice.id)), 'only explicitly approved expansion slices may become registered');

const frameRecords = [];
let sheets = 0;
let stableParityFrames = 0;
for (const entry of sourceEntries) {
  const sheetFrames = [];
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const candidate = captureEnemyExpansionFrame(entry.sourceRegistry, entry.sourceSpec, direction, animation.id, frame, engine.SIZE);
      const registered = captureEnemyExpansionFrame(entry.registeredRegistry, entry.registeredSpec, direction, animation.id, frame, engine.SIZE);
      const prefix = `${entry.kind}/${entry.registeredSpec.family}/${entry.registeredSpec.variant}/${direction}/${animation.id}/${frame}`;
      check(registered.digest === candidate.digest, `${prefix} registered pixels differ from the approved candidate`);
      check(registered.alphaDigest === candidate.alphaDigest, `${prefix} registered alpha differs from the approved candidate`);
      check(registered.outOfBoundsWrites.length === 0, `${prefix} registered rendering attempted an out-of-bounds write`);
      if (entry.kind === 'family') {
        const stable = captureEnemyExpansionFrame(engine.ENEMY_EXPANSION_REGISTRY, entry.registeredSpec, direction, animation.id, frame, engine.SIZE);
        check(stable.digest === registered.digest && stable.alphaDigest === registered.alphaDigest, `${prefix} stable-registry parity drifted`);
        stableParityFrames++;
      }
      frameRecords.push({
        kind: entry.kind,
        family: entry.kind === 'replacement' ? entry.target.family : entry.registeredSpec.family,
        variant: entry.kind === 'replacement' ? entry.target.variant : entry.registeredSpec.variant,
        sourceFamily: entry.sourceSpec.family,
        sourceVariant: entry.sourceSpec.variant,
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
  check(sheet.valid && sheet.frames === 80 && sheet.binaryAlpha, `${entry.registeredSpec.family}/${entry.registeredSpec.variant} registered sheet must satisfy the complete 80-frame contract`);
  sheets++;
}

check(frameRecords.length === 400, 'EN-E05 registration must verify all 400 approved frames');
check(stableParityFrames === 320, 'all 320 new-family frames must match through the composed stable registry');
check(sheets === 5, 'EN-E05 registration must verify five complete sheets');
const registeredFrameDigest = hashJson(frameRecords);
check(registeredFrameDigest === EN_E05_REGISTRATION_GATE.candidateFrameDigest, 'registered EN-E05 aggregate digest differs from the frozen candidate digest');

if (errors.length) {
  console.error('EN-E05 registration validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  console.error(`- Computed EN-E05 registered frame digest: ${registeredFrameDigest}`);
  process.exit(1);
}

console.log('EN-E05 registration validation passed.');
console.log('- Stable registry: 17 families / 43 variants across EN-E01, EN-E02, EN-E04, and EN-E05');
console.log('- Registered EN-E05 sheets: 5 (four new families plus one Ghoul replacement record)');
console.log('- Candidate/registered parity frames: 400; composed stable parity frames: 320');
console.log('- Current consumer boundary: 43 expansion families / public catalog 100 families / 316 variants');
console.log('- Public zombie/ghoul uses the approved replacement; frozen legacy fixture remains exact');
console.log(`- Approved EN-E05 aggregate digest: ${registeredFrameDigest}`);
