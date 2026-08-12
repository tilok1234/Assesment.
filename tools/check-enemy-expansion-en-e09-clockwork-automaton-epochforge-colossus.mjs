import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E08_RUNEFORGE_CUSTODIAN_GATE,
  EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-runeforge-custodian.js';
import {
  EN_E09_BRASSCOIL_SENTRY_GATE,
  EN_E09_BRASSCOIL_SENTRY_REGISTRY,
  EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e09-clockwork-automaton-brasscoil-sentry.js';
import {
  EN_E09_AETHERDIAL_SURVEYOR_GATE,
  EN_E09_AETHERDIAL_SURVEYOR_REGISTRY,
} from '../engine/enemy-expansion-en-e09-clockwork-automaton-aetherdial-surveyor.js';
import {
  EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT,
  EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT_CARD,
  EN_E09_EPOCHFORGE_COLOSSUS_DATA,
  EN_E09_EPOCHFORGE_COLOSSUS_DEATH_SOURCE_FRAMES,
  EN_E09_EPOCHFORGE_COLOSSUS_FAMILY,
  EN_E09_EPOCHFORGE_COLOSSUS_GATE,
  EN_E09_EPOCHFORGE_COLOSSUS_REGISTRY,
} from '../engine/enemy-expansion-en-e09-clockwork-automaton-epochforge-colossus.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame, mirrorPixels } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const hashJson = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const directions = ['down', 'left', 'right', 'up'];
const animations = [
  { id: 'idle', frames: 2 }, { id: 'walk', frames: 4 }, { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 }, { id: 'hurt', frames: 2 }, { id: 'death', frames: 4 },
];
const candidateSpec = { kind: 'enemy', family: 'clockwork-automaton', variant: 'epochforge-colossus' };
const aetherdialSpec = { kind: 'enemy', family: 'clockwork-automaton', variant: 'aetherdial-surveyor' };
const brasscoilSpec = { kind: 'enemy', family: 'clockwork-automaton', variant: 'brasscoil-sentry' };
const runeforgeSpec = { kind: 'enemy', family: 'animated-armor', variant: 'runeforge-custodian' };

function record(captured, spec, direction, animation, frame) {
  return { family: spec.family, variant: spec.variant, candidateFamily: spec.family, direction, animation, frame,
    digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds };
}

function componentCount(pixels) {
  const occupied = new Set(pixels.flatMap((color, index) => color ? [index] : []));
  let count = 0;
  while (occupied.size) {
    count++;
    const queue = [occupied.values().next().value];
    occupied.delete(queue[0]);
    while (queue.length) {
      const index = queue.shift();
      const x = index % 24; const y = Math.floor(index / 24);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = (ny * 24) + nx;
        if (nx >= 0 && ny >= 0 && nx < 24 && ny < 24 && occupied.delete(next)) queue.push(next);
      }
    }
  }
  return count;
}

const frameHash = async (relative) => createHash('sha256').update(await readFile(path.join(root, relative))).digest('hex');

check(
  EN_E09_EPOCHFORGE_COLOSSUS_GATE.status === 'awaiting-visual-approval'
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.baseCheckpoint === '0d5aec453d8bad9ba6d4c66a641963932d9c2e78'
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.authorizationEvidence.includes('lets do nexty')
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.authorizationEvidence.includes('only one private elite Epochforge Colossus')
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.approvedOn === null
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.approvedImplementation === null
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.publicationState === 'not-approved',
  'Epochforge Colossus private approval gate drifted',
);
check(
  EN_E09_EPOCHFORGE_COLOSSUS_GATE.precedingApproval.gateId === EN_E09_AETHERDIAL_SURVEYOR_GATE.id
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.precedingApproval.candidateFrameDigest === EN_E09_AETHERDIAL_SURVEYOR_GATE.candidateFrameDigest
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.precedingApproval.currentReconciliation === '0d5aec453d8bad9ba6d4c66a641963932d9c2e78'
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.precedingApproval.reconciliationPublication === 'published',
  'approved Aetherdial predecessor drifted',
);
check(
  EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected === 'baked-single-actor'
    && EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT_CARD.precedingVariant.id === 'aetherdial-surveyor'
    && EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT_CARD.activeVariant.identity === 'cog-crown-twin-furnace-hammer-colossus'
    && EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT_CARD.deferredRoles.length === 0
    && EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT.role === 'elite'
    && EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT.silhouette.includes('twin furnace chest')
    && EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT.visualIdentity.includes('hammer forearms')
    && EN_E09_EPOCHFORGE_COLOSSUS_DATA.childAssets.length === 0
    && EN_E09_EPOCHFORGE_COLOSSUS_DATA.bakedEffects.length === 0,
  'Epochforge elite identity or topology drifted',
);
check(
  EN_E09_EPOCHFORGE_COLOSSUS_GATE.scope.includes('80-frame Epochforge Colossus elite')
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.animationContract.includes('body-owned compression strike')
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.nextGate.includes('explicit designer visual approval')
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.exclusions.includes('public Clockwork Automaton registration')
    && EN_E09_EPOCHFORGE_COLOSSUS_GATE.exclusions.includes('additional Clockwork Automaton roles'),
  'Epochforge motion, exclusions, or stop gate drifted',
);
check(Object.isFrozen(EN_E09_EPOCHFORGE_COLOSSUS_GATE) && Object.isFrozen(EN_E09_EPOCHFORGE_COLOSSUS_DATA), 'gate and data must be frozen');
check(EN_E09_EPOCHFORGE_COLOSSUS_REGISTRY.families.length === 1 && EN_E09_EPOCHFORGE_COLOSSUS_REGISTRY.publicFamilies.length === 0 && EN_E09_EPOCHFORGE_COLOSSUS_FAMILY.variants.length === 1, 'private registry boundary drifted');
const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.PUBLIC_ENEMIES.length === 80 && publicVariantCount === 259 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'clockwork-automaton'), 'public 80/259 boundary drifted');
check(JSON.stringify(EN_E09_EPOCHFORGE_COLOSSUS_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'death alias mapping drifted');

const candidateRecords = []; const aetherdialRecords = []; const brasscoilRecords = []; const runeforgeRecords = [];
let connected = 0; let grounded = 0; let wide = 0; let flashes = 0; let colored = 0; let slitViews = 0;
let aetherdialDiff = 0; let aetherdialAlphaDiff = 0; let brasscoilDiff = 0; let runeforgeDiff = 0;
const candidateByKey = new Map();
for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const candidate = captureEnemyExpansionFrame(EN_E09_EPOCHFORGE_COLOSSUS_REGISTRY, candidateSpec, direction, animation.id, frame);
  const aetherdial = captureEnemyExpansionFrame(EN_E09_AETHERDIAL_SURVEYOR_REGISTRY, aetherdialSpec, direction, animation.id, frame);
  const brasscoil = captureEnemyExpansionFrame(EN_E09_BRASSCOIL_SENTRY_REGISTRY, brasscoilSpec, direction, animation.id, frame);
  const runeforge = captureEnemyExpansionFrame(EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY, runeforgeSpec, direction, animation.id, frame);
  const key = `${animation.id}/${direction}/${frame}`; candidateByKey.set(key, candidate);
  candidateRecords.push(record(candidate, candidateSpec, direction, animation.id, frame));
  aetherdialRecords.push(record(aetherdial, aetherdialSpec, direction, animation.id, frame));
  brasscoilRecords.push(record(brasscoil, brasscoilSpec, direction, animation.id, frame));
  runeforgeRecords.push(record(runeforge, runeforgeSpec, direction, animation.id, frame));
  if (componentCount(candidate.pixels) === 1) connected++;
  if (candidate.bounds.maxY === 22) grounded++;
  if ((candidate.bounds.maxX - candidate.bounds.minX + 1) >= 20) wide++;
  const colors = new Set(candidate.pixels.filter(Boolean));
  const isFlash = colors.size === 1 && colors.has('#f4f4f4');
  if (isFlash) flashes++; else colored++;
  if (!isFlash && direction !== 'up' && candidate.pixels.includes('#f2c36b')) slitViews++;
  if (candidate.digest !== aetherdial.digest) aetherdialDiff++;
  if (candidate.alphaDigest !== aetherdial.alphaDigest) aetherdialAlphaDiff++;
  if (candidate.digest !== brasscoil.digest) brasscoilDiff++;
  if (candidate.digest !== runeforge.digest) runeforgeDiff++;
  check(candidate.opaquePixels >= 200 && candidate.opaquePixels <= 390, `${key} opaque pixel count ${candidate.opaquePixels} left the elite range`);
  check(candidate.renderResult.childAssetCount === 0 && candidate.renderResult.approvedPrecedingGate === EN_E09_AETHERDIAL_SURVEYOR_GATE.id, `${key} renderer boundary drifted`);
  const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E09_EPOCHFORGE_COLOSSUS_DATA);
  check(presentation.formComplete.length === candidate.pixels.length, `${key} presentation size drifted`);
}

for (const direction of directions) for (let frame = 0; frame < 4; frame++) {
  check(candidateByKey.get(`cast/${direction}/${frame}`).digest === candidateByKey.get(`attack/${direction}/${frame}`).digest, `${direction} cast ${frame} must alias attack`);
  check(candidateByKey.get(`death/${direction}/${frame}`).digest === candidateByKey.get(`hurt/${direction}/${EN_E09_EPOCHFORGE_COLOSSUS_DEATH_SOURCE_FRAMES[frame]}`).digest, `${direction} death ${frame} must alias hurt`);
  check(JSON.stringify(candidateByKey.get(`walk/left/${frame}`).pixels) === JSON.stringify(mirrorPixels(candidateByKey.get(`walk/right/${frame}`).pixels)), `walk left/right ${frame} must mirror`);
}

const candidateDigest = hashJson(candidateRecords); const aetherdialDigest = hashJson(aetherdialRecords);
const brasscoilDigest = hashJson(brasscoilRecords); const runeforgeDigest = hashJson(runeforgeRecords);
if (EN_E09_EPOCHFORGE_COLOSSUS_GATE.candidateFrameDigest) check(candidateDigest === EN_E09_EPOCHFORGE_COLOSSUS_GATE.candidateFrameDigest, 'candidate digest drifted');
check(aetherdialDigest === EN_E09_AETHERDIAL_SURVEYOR_GATE.candidateFrameDigest, 'Aetherdial comparison source drifted');
check(brasscoilDigest === EN_E09_BRASSCOIL_SENTRY_GATE.candidateFrameDigest, 'Brasscoil comparison source drifted');
check(runeforgeDigest === EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest, 'Runeforge comparison source drifted');
check(connected === 80 && grounded === 80 && wide === 80, `structure totals drifted: connected ${connected}, grounded ${grounded}, wide ${wide}`);
check(flashes === 8 && colored === 72 && slitViews === 54, `palette totals drifted: flashes ${flashes}, colored ${colored}, slit ${slitViews}`);
check(aetherdialDiff === 80 && aetherdialAlphaDiff === 80 && brasscoilDiff === 80 && runeforgeDiff === 80, 'all comparison frames must differ');

for (const [field, relative] of [['artifactSha256', EN_E09_EPOCHFORGE_COLOSSUS_GATE.artifact], ['assembledArtifactSha256', EN_E09_EPOCHFORGE_COLOSSUS_GATE.assembledArtifact], ['comparisonArtifactSha256', EN_E09_EPOCHFORGE_COLOSSUS_GATE.comparisonArtifact]]) {
  if (EN_E09_EPOCHFORGE_COLOSSUS_GATE[field]) check(await frameHash(relative) === EN_E09_EPOCHFORGE_COLOSSUS_GATE[field], `${field} drifted`);
}

if (errors.length) {
  console.error('Epochforge Colossus check failed:'); for (const error of errors) console.error('- ' + error); process.exitCode = 1;
} else {
  console.log('Epochforge Colossus private elite candidate passes focused validation.');
  console.log(`- Structure: ${connected}/80 connected, ${grounded}/80 grounded, ${wide}/80 broad silhouettes`);
  console.log(`- Identity: ${colored}/72 colored frames, ${flashes}/8 exact flashes, ${slitViews}/54 readable sensor views`);
  console.log(`- Candidate frame digest: ${candidateDigest}`);
  console.log('- Protected: Aetherdial, Brasscoil, Runeforge exact; public 80/259; zero child assets/effects');
}
