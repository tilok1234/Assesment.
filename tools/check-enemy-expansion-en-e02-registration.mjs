import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  ENEMY_EXPANSION_PRE_REPAIR_REGISTRY,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY,
} from '../engine/enemy-expansion-repairs.js';
import {
  EN_E02_APPROVED_FAMILIES,
  EN_E02_CANDIDATE_REGISTRY,
  EN_E02_COMPLETED_SLICE_GATE,
  EN_E02_CONTRACT_CARDS,
  EN_E02_FULL_PRODUCTION_GATE,
  EN_E02_IDLE_GATE,
  EN_E02_PUBLIC_REGISTRY,
} from '../engine/enemy-expansion-en-e02.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const requireArtifacts = process.argv.includes('--require-artifacts');
let verifiedArtifacts = 0;

function check(condition, message) {
  if (!condition) errors.push(message);
}

async function fileSha256(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

async function checkArtifact(relativePath, expectedSha256, label) {
  try {
    check(await fileSha256(relativePath) === expectedSha256, 'the exact approved EN-E02 ' + label + ' bytes drifted');
    verifiedArtifacts++;
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    check(!requireArtifacts, 'the exact approved EN-E02 ' + label + ' is missing; regenerate the ignored review bundle');
  }
}

const expectedFamilies = ['catfolk', 'desert-raider', 'fanatic-monk', 'goatfolk', 'plague-doctor'];
const expectedRegisteredFamilies = [
  'alchemist',
  'birdfolk',
  'catfolk',
  'desert-raider',
  'fallen-knight',
  'fanatic-monk',
  'goatfolk',
  'lich',
  'merfolk',
  'mummy',
  'naga',
  'necromancer',
  'pirate',
  'plague-doctor',
  'revenant',
  'vampire',
  'witch',
];
const expectedVariants = {
  'plague-doctor': ['field-chirurgeon', 'leech-warden', 'pestilent-magister'],
  'desert-raider': ['dune-reaver', 'sandbow-stalker', 'sunscar-captain'],
  'fanatic-monk': ['ash-disciple', 'chain-penitent', 'bell-abbot'],
  catfolk: ['alley-prowler', 'moonclaw-duelist', 'pride-champion'],
  goatfolk: ['crag-skirmisher', 'horn-seer', 'ramguard-chieftain'],
};

check(EN_E02_IDLE_GATE.status === 'approved', 'registration must preserve the exact approved EN-E02 Idle gate');
check(EN_E02_FULL_PRODUCTION_GATE.status === 'authorized', 'registration must preserve the bounded full-production authorization');
check(EN_E02_COMPLETED_SLICE_GATE.status === 'approved', 'registration needs explicit completed-slice approval');
check(EN_E02_COMPLETED_SLICE_GATE.approvedOn === '2026-08-02', 'completed-slice approval must record its date');
check(EN_E02_COMPLETED_SLICE_GATE.implementationCommit === 'b2c1283c33dbfd6b2c307fc4d2288877a149c9df', 'completed-slice approval must identify the reviewed implementation commit');
check(EN_E02_COMPLETED_SLICE_GATE.artifactSha256 === '21f3175600377eaf75206f9fcb65856731da28eafb6715687821f782f41da6a8', 'completed-slice overview hash drifted');
check(EN_E02_COMPLETED_SLICE_GATE.presentationArtifactSha256 === '211e9ace3eb965f243724249c73927567568e2f22f181f5448ba398ddab4a094', 'completed-slice outline/Form presentation hash drifted');
check(EN_E02_COMPLETED_SLICE_GATE.reviewManifestSha256 === '0a135fbed3eeeaf69400a3700d113af67a0c2a75043f95ab2a392711cd6b0afa', 'completed-slice review-manifest hash drifted');
check(EN_E02_COMPLETED_SLICE_GATE.candidateFrameDigest === 'f4667a1ccefb3026c6df3604e114393fdaae619dab0c68bec969203986cb35bf', 'completed-slice frame digest drifted');
check(Object.isFrozen(EN_E02_COMPLETED_SLICE_GATE), 'completed-slice approval evidence must be immutable');

await checkArtifact(
  EN_E02_COMPLETED_SLICE_GATE.artifact,
  EN_E02_COMPLETED_SLICE_GATE.artifactSha256,
  'overview',
);
await checkArtifact(
  EN_E02_COMPLETED_SLICE_GATE.presentationArtifact,
  EN_E02_COMPLETED_SLICE_GATE.presentationArtifactSha256,
  'outline/Form presentation',
);
await checkArtifact(
  EN_E02_COMPLETED_SLICE_GATE.reviewManifest,
  EN_E02_COMPLETED_SLICE_GATE.reviewManifestSha256,
  'review manifest',
);

check(EN_E02_CANDIDATE_REGISTRY.families.length === 5, 'the reviewed candidate must retain five evidence families');
check(EN_E02_CANDIDATE_REGISTRY.families.every((family) => family.state === engine.ENEMY_EXPANSION_STATES.IMPLEMENTED), 'candidate evidence must remain implemented rather than retroactively approved');
check(EN_E02_CANDIDATE_REGISTRY.publicFamilies.length === 0, 'candidate evidence must remain non-public');

check(EN_E02_APPROVED_FAMILIES.length === 5, 'EN-E02 registration needs exactly five approved families');
check(JSON.stringify(EN_E02_PUBLIC_REGISTRY.families.map((family) => family.id)) === JSON.stringify(expectedFamilies), 'EN-E02 family order must be deterministic');
check(EN_E02_PUBLIC_REGISTRY.families.every((family) => family.state === engine.ENEMY_EXPANSION_STATES.APPROVED), 'every registered EN-E02 family must be approved');
check(EN_E02_PUBLIC_REGISTRY.approvedFamilies.length === 5, 'all five registered EN-E02 families must enter the approved view');
check(EN_E02_PUBLIC_REGISTRY.publicFamilies.length === 5, 'all five registered EN-E02 families must enter the registry public view');
check(EN_E02_PUBLIC_REGISTRY.renderers.length === 1, 'registered EN-E02 must retain one shared renderer');
check(EN_E02_PUBLIC_REGISTRY.renderers[0].key === 'humanoid-threat-v1', 'registered EN-E02 must retain the reviewed renderer key');
check(EN_E02_PUBLIC_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'registered EN-E02 must retain the reviewed chassis');
check(Object.isFrozen(EN_E02_PUBLIC_REGISTRY), 'the EN-E02 registered slice must be immutable');

for (const card of EN_E02_CONTRACT_CARDS) {
  const family = EN_E02_PUBLIC_REGISTRY.families.find((entry) => entry.id === card.id);
  const publicFamily = EN_E02_PUBLIC_REGISTRY.publicFamilies.find((entry) => entry.id === card.id);
  check(Boolean(family) && Boolean(publicFamily), 'EN-E02 registration is missing ' + card.id);
  if (!family || !publicFamily) continue;
  check(JSON.stringify(family.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[card.id]), card.id + ' must register common, specialist, elite in reviewed order');
  check(JSON.stringify(publicFamily.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[card.id]), card.id + ' registry public view has the wrong variants');
  check(publicFamily.variants.every((variant) => !Object.hasOwn(variant, 'brief')), card.id + ' public variants must omit internal production briefs');
  check(family.variants.every((variant) => variant.rendererData?.actor && Array.isArray(variant.rendererData?.identity?.overlays)), card.id + ' registered variants need complete renderer data');
  check(family.variants.every((variant) => !/\b(effect|projectile|summon|familiar|explosion|smoke cloud)\b/i.test(JSON.stringify(variant.rendererData))), card.id + ' registered renderer data must not bake external effect or child-asset contracts');
}

check(JSON.stringify(engine.ENEMY_EXPANSION_REGISTRY.families.map((family) => family.id)) === JSON.stringify(expectedRegisteredFamilies), 'the later stable registry must contain exactly the seventeen approved EN-E01/EN-E02/EN-E04/EN-E05 families');
check(engine.ENEMY_EXPANSION_REGISTRY.publicFamilies.length === 17, 'the later stable registry must expose seventeen approved family records');
check(engine.ENEMY_EXPANSION_REGISTRY.renderers.length === 8, 'the composed stable registry must retain four earlier renderers plus four bounded EN-E05 renderers');
check(Object.isFrozen(engine.ENEMY_EXPANSION_REGISTRY), 'the composed approved registry must be immutable');

check(ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE.status === 'approved', 'the repair boundary must record explicit visual approval');
check(engine.ENEMY_EXPANSION_REGISTRY !== ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, 'the stable registry must compose later approved registrations without rewriting EN-E02 repair evidence');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY !== engine.ENEMY_EXPANSION_REGISTRY, 'the later EN-E05 stable registration must remain outside the exact EN-E04 consumer boundary');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies.length === 13, 'consumer routing must contain the thirteen approved EN-E01/EN-E02/EN-E04 families');
const publicVariants = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
check(engine.PUBLIC_ENEMIES.length === 70 && publicVariants === 241, 'the later consumer gate must expose the 70-family / 241-variant catalog');
check(EN_E02_CONTRACT_CARDS.every((card) => engine.PUBLIC_ENEMIES.some((family) => family.id === card.id)), 'authorized EN-E02 families must enter generic consumers through PUBLIC_ENEMIES');
check(EN_E02_CONTRACT_CARDS.every((card) => engine.isPublicEnemyExpansionSpec({ kind: 'enemy', family: card.id, variant: card.baseline.variantId })), 'authorized EN-E02 families must route through the public consumer renderer');
check(engine.ENEMIES.length === 57, 'EN-E02 registration must not rewrite the 57-family legacy catalog');

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(facadeSource.includes("from './engine/enemy-expansion-public.js'"), 'the stable facade must export the approved registry boundary');
check(!facadeSource.includes('enemy-expansion-en-e02'), 'the stable facade must not import EN-E02 implementation details directly');
check(!facadeSource.includes('EN_E02_'), 'the stable facade must not expose slice-specific implementation symbols');

for (const relativePath of [
  'app.js',
  'character-kit.js',
  'engine/combat-loadouts.js',
  'engine/generators.js',
  'engine/public-game-pack.js',
  'engine/public-renderer.js',
  'engine/shade-renderer.js',
]) {
  const source = await readFile(path.join(root, relativePath), 'utf8');
  check(!source.includes('enemy-expansion-en-e02') && !source.includes('EN_E02_'), relativePath + ' must not couple consumers directly to EN-E02');
}

const ledgerReport = engine.buildEnemyExpansionLedgerReport();
check(ledgerReport.counts.slices === 22 && ledgerReport.counts.proposals === 80, 'registration must preserve the 22-slice / 80-proposal ledger');
check(ledgerReport.counts.approved === 5 && ledgerReport.counts.implemented === 0 && ledgerReport.counts.planned === 17, 'current ledger lifecycle counts must be five approved, zero implemented, and seventeen planned');
check(ledgerReport.counts.registeredFamilies === 17 && ledgerReport.counts.publicFamilies === 17, 'current ledger must report seventeen registered and registry-public families');
const enE02Slice = ledgerReport.slices.find((slice) => slice.id === 'EN-E02');
check(enE02Slice?.state === engine.ENEMY_EXPANSION_STATES.APPROVED, 'EN-E02 ledger state must be approved');
check(enE02Slice?.gate === 'completed-slice-approved-2026-08-02', 'EN-E02 ledger gate must record completed-slice approval');
check(enE02Slice?.registeredFamilies === 5 && enE02Slice?.publicFamilies === 5, 'EN-E02 ledger row must report all five registered families');
check(ledgerReport.slices.filter((slice) => slice.publicFamilies > 0).every((slice) => ['EN-E01', 'EN-E02', 'EN-E04', 'EN-E05'].includes(slice.id)), 'no unapproved expansion slice may become registered implicitly');

const frameRecords = [];
let sheets = 0;
for (const card of EN_E02_CONTRACT_CARDS) for (const variantBrief of card.variantBriefs) {
  const spec = { kind: 'enemy', family: card.id, variant: variantBrief.id };
  const sheetFrames = [];
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const candidate = captureEnemyExpansionFrame(EN_E02_CANDIDATE_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
      const registered = captureEnemyExpansionFrame(ENEMY_EXPANSION_PRE_REPAIR_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
      const prefix = [card.id, variantBrief.id, direction, animation.id, frame].join('/');
      check(registered.digest === candidate.digest, prefix + ' registered pixels differ from the reviewed candidate');
      check(registered.alphaDigest === candidate.alphaDigest, prefix + ' registered alpha differs from the reviewed candidate');
      check(registered.outOfBoundsWrites.length === 0, prefix + ' registered rendering attempted out-of-bounds drawing');
      frameRecords.push({
        family: card.id,
        variant: variantBrief.id,
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
  check(sheet.valid && sheet.frames === 80 && sheet.binaryAlpha, card.id + '/' + variantBrief.id + ' registered sheet must satisfy the complete contract');
  sheets++;
}

check(frameRecords.length === 1200, 'EN-E02 registration must verify all 1,200 reviewed frames');
check(sheets === 15, 'EN-E02 registration must verify 15 complete sheets');
const registeredFrameDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(registeredFrameDigest === EN_E02_COMPLETED_SLICE_GATE.candidateFrameDigest, 'registered EN-E02 aggregate digest differs from the approved candidate');

const idleRecords = frameRecords.filter((record) => (
  record.animation === 'idle'
  && record.frame < 2
  && EN_E02_CONTRACT_CARDS.some((card) => card.id === record.family && card.baseline.variantId === record.variant)
)).map(({ variant, animation, ...record }) => record);
const registeredIdleDigest = createHash('sha256').update(JSON.stringify(idleRecords)).digest('hex');
check(registeredIdleDigest === EN_E02_IDLE_GATE.candidateFrameDigest, 'registration changed the approved common-baseline Idle digest');

if (errors.length) {
  console.error('EN-E02 registration validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E02 registration validation passed.');
console.log('- Approved registry: 10 families / 30 variants across EN-E01 and EN-E02');
console.log('- Registered EN-E02 sheets: 15 (480x96)');
console.log('- Candidate/registered parity frames: 1,200');
console.log('- Consumer catalog: 70 families / 241 variants (EN-E01 + EN-E02 + EN-E04)');
console.log('- Ignored review artifact bytes: ' + (verifiedArtifacts === 3 ? '3 / 3 verified' : 'not present; immutable hash locks verified'));
console.log('- Approved EN-E02 Idle digest: ' + registeredIdleDigest);
console.log('- Approved EN-E02 full-candidate digest: ' + registeredFrameDigest);
