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
  EN_E01_APPROVED_FAMILIES,
  EN_E01_CANDIDATE_REGISTRY,
  EN_E01_COMPLETED_SLICE_GATE,
  EN_E01_CONTRACT_CARDS,
  EN_E01_IDLE_GATE,
  EN_E01_PUBLIC_REGISTRY,
} from '../engine/enemy-expansion-en-e01.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

const expectedFamilies = ['alchemist', 'fallen-knight', 'necromancer', 'pirate', 'witch'];
const expectedVariants = {
  witch: ['hexer', 'familiar-keeper', 'cauldron-brewer'],
  'fallen-knight': ['shieldbearer', 'banner-lancer', 'blackguard'],
  pirate: ['deckhand', 'gunner', 'bomb-bosun'],
  necromancer: ['bone-caller', 'grave-binder', 'ossuary-master'],
  alchemist: ['flask-thrower', 'smoke-brewer', 'mutagenist'],
};

check(EN_E01_IDLE_GATE.status === 'approved', 'public registration must preserve the exact approved Idle gate');
check(EN_E01_COMPLETED_SLICE_GATE.status === 'approved', 'public registration needs explicit completed-slice approval');
check(EN_E01_COMPLETED_SLICE_GATE.approvedOn === '2026-08-02', 'completed-slice approval must record its date');
check(EN_E01_COMPLETED_SLICE_GATE.implementationCommit === '230a9a39fecc56104f2dd18fce5cef5517658146', 'completed-slice approval must identify the reviewed implementation commit');
check(EN_E01_COMPLETED_SLICE_GATE.artifactSha256 === '0b38f2737b5215d37a08e0ae3f7e25f82e88bb17a97641e33b0ee9ef9c0e8fb7', 'completed-slice overview hash drifted');
check(EN_E01_COMPLETED_SLICE_GATE.reviewManifestSha256 === '129f3f2b81318df08edf2b0b1dc2183fc8494450027e91ceea04a2248208e398', 'completed-slice review-manifest hash drifted');
check(EN_E01_COMPLETED_SLICE_GATE.candidateFrameDigest === 'addcf8055a80a0a6266be0eff8cd6b8235092c6ba366bc9c020bd5feb90ae173', 'completed-slice frame digest drifted');
check(Object.isFrozen(EN_E01_COMPLETED_SLICE_GATE), 'completed-slice approval evidence must be immutable');

check(
  JSON.stringify(engine.ENEMY_EXPANSION_REGISTRY.families.filter((family) => family.sliceId === 'EN-E01').map((family) => family.id)) === JSON.stringify(expectedFamilies),
  'the cumulative stable registry must retain all five approved EN-E01 families',
);
check(ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE.status === 'approved', 'the repair boundary must record explicit visual approval');
check(engine.ENEMY_EXPANSION_REGISTRY !== ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, 'the stable registry must compose later approved registrations without rewriting EN-E01 repair evidence');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'the later EN-E05 consumer gate must reuse the exact stable registry');
check(EN_E01_APPROVED_FAMILIES.length === 5, 'public EN-E01 registration needs exactly five approved families');
check(JSON.stringify(EN_E01_PUBLIC_REGISTRY.families.map((family) => family.id)) === JSON.stringify(expectedFamilies), 'public EN-E01 family order must be deterministic');
check(EN_E01_PUBLIC_REGISTRY.families.every((family) => family.state === engine.ENEMY_EXPANSION_STATES.APPROVED), 'every registered EN-E01 family must be approved');
check(EN_E01_PUBLIC_REGISTRY.approvedFamilies.length === 5, 'all five registered EN-E01 families must enter the approved view');
check(EN_E01_PUBLIC_REGISTRY.publicFamilies.length === 5, 'all five registered EN-E01 families must enter the public view');
check(EN_E01_PUBLIC_REGISTRY.renderers.length === 1, 'public EN-E01 must retain one shared renderer');
check(EN_E01_PUBLIC_REGISTRY.renderers[0].key === 'humanoid-threat-v1', 'public EN-E01 must retain the reviewed renderer key');
check(EN_E01_PUBLIC_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'public EN-E01 must retain the reviewed chassis');
check(Object.isFrozen(EN_E01_PUBLIC_REGISTRY), 'the public EN-E01 registry must be immutable');

for (const card of EN_E01_CONTRACT_CARDS) {
  const family = EN_E01_PUBLIC_REGISTRY.families.find((entry) => entry.id === card.id);
  const publicFamily = EN_E01_PUBLIC_REGISTRY.publicFamilies.find((entry) => entry.id === card.id);
  check(Boolean(family) && Boolean(publicFamily), 'public registration is missing ' + card.id);
  if (!family || !publicFamily) continue;
  check(JSON.stringify(family.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[card.id]), card.id + ' must publish common, specialist, elite in reviewed order');
  check(JSON.stringify(publicFamily.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[card.id]), card.id + ' public family view has the wrong variants');
  check(publicFamily.variants.every((variant) => !Object.hasOwn(variant, 'brief')), card.id + ' public variants must omit internal production briefs');
  check(family.variants.every((variant) => variant.rendererData?.actor && Array.isArray(variant.rendererData?.identity?.overlays)), card.id + ' registered variants need complete renderer data');
  check(family.variants.every((variant) => !/\b(effect|projectile|summon|familiar|cauldron|explosion|smoke cloud)\b/i.test(JSON.stringify(variant.rendererData))), card.id + ' public renderer data must not bake external effect or child-asset contracts');
}

check(engine.ENEMIES.length === 57, 'public expansion registration must not rewrite the 57-family legacy catalog');
check(EN_E01_CONTRACT_CARDS.every((card) => !engine.ENEMIES.some((family) => family.id === card.id)), 'approved expansion IDs must remain separate from the legacy catalog');

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(facadeSource.includes("from './engine/enemy-expansion-public.js'"), 'the stable facade must export the approved public expansion boundary');
check(!facadeSource.includes('enemy-expansion-en-e01'), 'the stable facade must not import slice implementation details directly');
check(!facadeSource.includes('EN_E01_'), 'the stable facade must not expose slice-specific implementation symbols');

const ledgerReport = engine.buildEnemyExpansionLedgerReport();
check(ledgerReport.counts.slices === 22 && ledgerReport.counts.proposals === 80, 'public registration must preserve the 22-slice / 80-proposal ledger');
check(ledgerReport.counts.approved === 7 && ledgerReport.counts.implemented === 0 && ledgerReport.counts.planned === 15, 'current ledger lifecycle counts must be seven approved, zero implemented, and fifteen planned');
check(ledgerReport.counts.registeredFamilies === 43 && ledgerReport.counts.publicFamilies === 43, 'current ledger must report forty-three registered approved families');
const enE01Slice = ledgerReport.slices.find((slice) => slice.id === 'EN-E01');
check(enE01Slice?.state === engine.ENEMY_EXPANSION_STATES.APPROVED, 'EN-E01 ledger state must be approved');
check(enE01Slice?.registeredFamilies === 5 && enE01Slice?.publicFamilies === 5, 'EN-E01 ledger row must report all five public families');
check(ledgerReport.slices.filter((slice) => slice.publicFamilies > 0).every((slice) => ['EN-E01', 'EN-E02', 'EN-E03', 'EN-E04', 'EN-E05', 'EN-E06', 'EN-E07', 'EN-E08', 'EN-E09', 'EN-E10', 'EN-E11'].includes(slice.id)), 'only explicitly approved expansion slices may become registered');

const frameRecords = [];
let sheets = 0;
for (const card of EN_E01_CONTRACT_CARDS) for (const variantBrief of card.variantBriefs) {
  const spec = { kind: 'enemy', family: card.id, variant: variantBrief.id };
  const sheetFrames = [];
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const candidate = captureEnemyExpansionFrame(EN_E01_CANDIDATE_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
      const registered = captureEnemyExpansionFrame(ENEMY_EXPANSION_PRE_REPAIR_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
      const prefix = [card.id, variantBrief.id, direction, animation.id, frame].join('/');
      check(registered.digest === candidate.digest, prefix + ' public pixels differ from the reviewed candidate');
      check(registered.alphaDigest === candidate.alphaDigest, prefix + ' public alpha differs from the reviewed candidate');
      check(registered.outOfBoundsWrites.length === 0, prefix + ' public rendering attempted out-of-bounds drawing');
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
  check(sheet.valid && sheet.frames === 80 && sheet.binaryAlpha, card.id + '/' + variantBrief.id + ' public sheet must satisfy the complete contract');
  sheets++;
}

check(frameRecords.length === 1200, 'public EN-E01 registration must verify all 1,200 reviewed frames');
check(sheets === 15, 'public EN-E01 registration must verify 15 complete sheets');
const publicFrameDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(publicFrameDigest === EN_E01_COMPLETED_SLICE_GATE.candidateFrameDigest, 'public EN-E01 aggregate digest differs from the approved candidate');

const idleRecords = frameRecords.filter((record) => (
  record.animation === 'idle'
  && record.frame < 2
  && EN_E01_CONTRACT_CARDS.some((card) => card.id === record.family && card.baseline.variantId === record.variant)
)).map(({ variant, animation, ...record }) => record);
const publicIdleDigest = createHash('sha256').update(JSON.stringify(idleRecords)).digest('hex');
check(publicIdleDigest === EN_E01_IDLE_GATE.candidateFrameDigest, 'public registration changed the approved common-baseline Idle digest');

if (errors.length) {
  console.error('EN-E01 public registration validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E01 public registration validation passed.');
console.log('- Approved families: 5');
console.log('- Public variants: 15 (5 common / 5 specialist / 5 elite)');
console.log('- Complete public sheets: 15 (480x96)');
console.log('- Candidate/public parity frames: 1,200');
console.log('- Legacy catalog: 57 families / 202 variants (unchanged)');
console.log('- Approved Idle digest: ' + publicIdleDigest);
console.log('- Approved full-candidate digest: ' + publicFrameDigest);
