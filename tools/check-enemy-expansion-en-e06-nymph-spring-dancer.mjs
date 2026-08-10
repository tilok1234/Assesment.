import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { ENEMY_EXPANSION_LEDGER } from '../engine/enemy-expansion.js';
import { EN_E06_CONTRACT_CARDS } from '../engine/enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_FAIRY_GATE, EN_E06_FAIRY_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy.js';
import { EN_E06_THISTLE_HEXER_GATE, EN_E06_THISTLE_HEXER_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy-thistle-hexer.js';
import { EN_E06_PETALCROWN_DUELIST_GATE, EN_E06_PETALCROWN_DUELIST_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy-petalcrown-duelist.js';
import { EN_E06_MIRE_CRONE_GATE, EN_E06_MIRE_CRONE_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-mire-crone.js';
import { EN_E06_CAULDRON_HEXER_GATE, EN_E06_CAULDRON_HEXER_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-cauldron-hexer.js';
import { EN_E06_BLACKTHORN_MATRON_GATE, EN_E06_BLACKTHORN_MATRON_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-blackthorn-matron.js';
import { EN_E06_GROVE_TENDER_GATE, EN_E06_GROVE_TENDER_REGISTRY } from '../engine/enemy-expansion-en-e06-dryad-grove-tender.js';
import { EN_E06_SPORE_CANTOR_GATE, EN_E06_SPORE_CANTOR_REGISTRY } from '../engine/enemy-expansion-en-e06-dryad-spore-cantor.js';
import { EN_E06_HEARTWOOD_WARDEN_GATE, EN_E06_HEARTWOOD_WARDEN_REGISTRY } from '../engine/enemy-expansion-en-e06-dryad-heartwood-warden.js';
import { EN_E06_BARROW_STALKER_GATE, EN_E06_BARROW_STALKER_REGISTRY } from '../engine/enemy-expansion-en-e06-redcap-barrow-stalker.js';
import { EN_E06_IRONBOOT_TRAPPER_GATE, EN_E06_IRONBOOT_TRAPPER_REGISTRY } from '../engine/enemy-expansion-en-e06-redcap-ironboot-trapper.js';
import { EN_E06_BLOODCAP_REAVER_GATE, EN_E06_BLOODCAP_REAVER_REGISTRY } from '../engine/enemy-expansion-en-e06-redcap-bloodcap-reaver.js';
import { EN_E06_SPRING_DANCER_CONTRACT, EN_E06_SPRING_DANCER_DATA, EN_E06_SPRING_DANCER_DEATH_SOURCE_FRAMES, EN_E06_SPRING_DANCER_FAMILY, EN_E06_SPRING_DANCER_GATE, EN_E06_SPRING_DANCER_REGISTRY } from '../engine/enemy-expansion-en-e06-nymph-spring-dancer.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { alphaDigest, captureEnemyExpansionFrame, pixelDigest } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = []; const check = (condition, message) => { if (!condition) errors.push(message); };
const directions = ['down', 'left', 'right', 'up'];
const animations = [{ id: 'idle', frames: 2 }, { id: 'walk', frames: 4 }, { id: 'attack', frames: 4 }, { id: 'cast', frames: 4 }, { id: 'hurt', frames: 2 }, { id: 'death', frames: 4 }];
const candidateSpec = { kind: 'enemy', family: 'nymph', variant: 'spring-dancer' };
const elfMageSpec = { kind: 'enemy', family: 'elf', variant: 'mage' };
const fairySpec = { kind: 'enemy', family: 'fairy', variant: 'bramblewing-scout' };
const groveSpec = { kind: 'enemy', family: 'dryad', variant: 'grove-tender' };
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
];
const frameKey = (direction, animation, frame) => `${direction}/${animation}/${frame}`;
const hashJson = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const frameRecord = (captured, family, variant, direction, animation, frame, candidateFamily = true) => ({ family, variant, ...(candidateFamily ? { candidateFamily: family } : {}), direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });
function mirrorPixels(pixels) { const result = new Array(576).fill(null); for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) result[(y * 24) + (23 - x)] = pixels[(y * 24) + x]; return result; }
function components(pixels) { const seen = new Set(); let count = 0; for (let index = 0; index < 576; index++) { if (!pixels[index] || seen.has(index)) continue; count++; const queue = [index]; seen.add(index); while (queue.length) { const current = queue.pop(), x = current % 24; for (const neighbor of [current - 24, current + 24, x ? current - 1 : -1, x < 23 ? current + 1 : -1]) if (neighbor >= 0 && neighbor < 576 && pixels[neighbor] && !seen.has(neighbor)) { seen.add(neighbor); queue.push(neighbor); } } } return count; }
function countColors(pixels, colors) { return pixels.reduce((sum, color) => sum + (colors.has(color) ? 1 : 0), 0); }
async function sha256File(relativePath) { return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex'); }
function rejects(action, label) { try { action(); errors.push(`${label} must reject`); } catch (error) { check(String(error.message).includes('is not implemented'), `${label} rejected unexpectedly: ${error.message}`); } }

function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(576).fill(null), outOfBoundsWrites = []; let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py, operation: 'clearRect' }); else pixels[(py * 24) + px] = null; } },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py, operation: 'fillRect', color: fillStyle }); else pixels[(py * 24) + px] = fillStyle; } },
  };
  drawLegacySprite(context, spec, direction, animation, frame, { shadow: false });
  const occupied = pixels.flatMap((color, index) => color === null ? [] : [{ x: index % 24, y: Math.floor(index / 24) }]);
  const bounds = occupied.length ? { minX: Math.min(...occupied.map(({ x }) => x)), minY: Math.min(...occupied.map(({ y }) => y)), maxX: Math.max(...occupied.map(({ x }) => x)), maxY: Math.max(...occupied.map(({ y }) => y)) } : null;
  return Object.freeze({ pixels: Object.freeze(pixels), alpha: Uint8Array.from(pixels, (color) => color === null ? 0 : 255), opaquePixels: occupied.length, bounds: bounds && Object.freeze(bounds), outOfBoundsWrites: Object.freeze(outOfBoundsWrites), digest: pixelDigest(pixels), alphaDigest: alphaDigest(pixels) });
}

check(EN_E06_SPRING_DANCER_GATE.status === 'approved' && EN_E06_SPRING_DANCER_GATE.approvedOn === '2026-08-10' && EN_E06_SPRING_DANCER_GATE.publishedImplementation === '9d6366b0c5456704137aadfbbec9a67eccb5fd7c', 'candidate approval state drifted');
check(EN_E06_SPRING_DANCER_GATE.approvalEvidence.includes('three exact PNG review boards were opened together in Aseprite') && EN_E06_SPRING_DANCER_GATE.approvalEvidence.includes('designer replied: approved') && EN_E06_SPRING_DANCER_GATE.approvalEvidence.includes('Mist Weaver, Rivercrown Muse, Nymph registration'), 'approval evidence drifted');
check(EN_E06_SPRING_DANCER_GATE.authorizedOn === '2026-08-10' && EN_E06_SPRING_DANCER_GATE.authorizationEvidence.includes('designer said: lets do next') && EN_E06_SPRING_DANCER_GATE.authorizationEvidence.includes('only one private common Nymph Spring Dancer'), 'authorization evidence drifted');
check(EN_E06_SPRING_DANCER_GATE.baseCheckpoint === 'f4ac500d39da0ac2ecd033c939ac582d06c2d052', 'candidate base checkpoint drifted');
check(EN_E06_SPRING_DANCER_GATE.precedingApproval.gateId === EN_E06_BLOODCAP_REAVER_GATE.id && EN_E06_SPRING_DANCER_GATE.precedingApproval.publishedImplementation === EN_E06_BLOODCAP_REAVER_GATE.publishedImplementation && EN_E06_SPRING_DANCER_GATE.precedingApproval.publishedHandoff === 'f4ac500d39da0ac2ecd033c939ac582d06c2d052', 'approved Bloodcap predecessor drifted');
check(EN_E06_SPRING_DANCER_GATE.scope.includes('complete 80-frame Spring Dancer common') && EN_E06_SPRING_DANCER_GATE.animationContract.includes('forward fan') && EN_E06_SPRING_DANCER_GATE.animationContract.includes('Cast aliases Attack exactly'), 'full-suite or motion contract drifted');
check(EN_E06_SPRING_DANCER_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E06_SPRING_DANCER_GATE.exclusions.includes('changes to approved Bloodcap Reaver source or pixels') && EN_E06_SPRING_DANCER_GATE.exclusions.includes('Mist Weaver implementation'), 'scope exclusions drifted');
check(EN_E06_SPRING_DANCER_GATE.nextGate.includes('visually approved') && EN_E06_SPRING_DANCER_GATE.nextGate.includes('After push, stop') && EN_E06_SPRING_DANCER_GATE.nextGate.includes('without another explicit gate'), 'approved stop gate drifted');
check(Object.isFrozen(EN_E06_SPRING_DANCER_GATE) && Object.isFrozen(EN_E06_SPRING_DANCER_DATA), 'gate and data must be deeply immutable');
check(EN_E06_SPRING_DANCER_CONTRACT.family === 'nymph' && EN_E06_SPRING_DANCER_CONTRACT.variant === 'spring-dancer' && EN_E06_SPRING_DANCER_CONTRACT.role === 'common', 'candidate contract drifted');
check(EN_E06_SPRING_DANCER_CONTRACT.silhouette.includes('long flowing hair') && EN_E06_SPRING_DANCER_CONTRACT.silhouette.includes('ribbon-edged dress') && EN_E06_SPRING_DANCER_CONTRACT.effectBoundary.includes('Petals') && EN_E06_SPRING_DANCER_CONTRACT.effectBoundary.includes('remain external'), 'Nymph identity/effect boundary drifted');
check(ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E06')?.gate === 'eight-enemy-registration-authorized-2026-08-09', 'isolated candidate must not rewrite the approved registration ledger');

check(EN_E06_CONTRACT_CARDS[0].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Fairies must remain approved');
check(EN_E06_CONTRACT_CARDS[1].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Hags must remain approved');
check(EN_E06_CONTRACT_CARDS[2].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Dryads must remain approved');
check(EN_E06_CONTRACT_CARDS[3].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Redcaps must remain approved');
check(EN_E06_CONTRACT_CARDS[4].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/implemented-full-approved/implemented-full-candidate', 'Nymph role-order status drifted');
check(EN_E06_SPRING_DANCER_REGISTRY.families.length === 1 && EN_E06_SPRING_DANCER_REGISTRY.publicFamilies.length === 0 && EN_E06_SPRING_DANCER_FAMILY.variants.length === 1, 'candidate registry boundary drifted');
const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 80 && publicVariantCount === 259 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'nymph'), 'candidate must preserve public 80/259 and keep Nymph private');
check(engine.EN_E06_SPRING_DANCER_REGISTRY === undefined, 'candidate must not leak through the facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8'), facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8'), manifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e06-nymph-spring-dancer') && !facadeSource.includes('enemy-expansion-en-e06-nymph-spring-dancer') && !manifest.includes('spring-dancer'), 'public or fixture firewall drifted');

const captures = new Map(), candidateRecords = [], elfRecords = [], fairyRecords = [], groveRecords = [];
const palettes = ['skin', 'hair', 'dress', 'ribbon', 'leaf', 'sandal', 'gold'].map((name) => [name, new Set(EN_E06_SPRING_DANCER_DATA.springDancer[name])]);
let connected = 0, bounded = 0, grounded = 0, colored = 0, flashes = 0, elfDifferences = 0, elfAlphaDifferences = 0, fairyDifferences = 0, fairyAlphaDifferences = 0, groveDifferences = 0, groveAlphaDifferences = 0, completeB = 0, formChanges = 0, minOpaque = Infinity, maxOpaque = 0;
for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const candidate = captureEnemyExpansionFrame(EN_E06_SPRING_DANCER_REGISTRY, candidateSpec, direction, animation.id, frame);
  const elf = captureLegacyFrame(elfMageSpec, direction, animation.id, frame);
  const fairy = captureEnemyExpansionFrame(EN_E06_FAIRY_REGISTRY, fairySpec, direction, animation.id, frame);
  const grove = captureEnemyExpansionFrame(EN_E06_GROVE_TENDER_REGISTRY, groveSpec, direction, animation.id, frame);
  captures.set(key, candidate); candidateRecords.push(frameRecord(candidate, 'nymph', 'spring-dancer', direction, animation.id, frame)); elfRecords.push(frameRecord(elf, 'elf', 'mage', direction, animation.id, frame, false)); fairyRecords.push(frameRecord(fairy, 'fairy', 'bramblewing-scout', direction, animation.id, frame)); groveRecords.push(frameRecord(grove, 'dryad', 'grove-tender', direction, animation.id, frame));
  check(candidate.outOfBoundsWrites.length === 0 && candidate.alpha.every((value) => value === 0 || value === 255), `${key} must stay in-cell with hard alpha`);
  const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22; if (isBounded) bounded++; else check(false, `${key} lost one-cell margin`);
  const isGrounded = candidate.bounds && candidate.bounds.maxY >= 20 && candidate.bounds.maxY <= 22; if (isGrounded) grounded++; else check(false, `${key} lost ground contact`);
  const componentCount = components(candidate.pixels); if (componentCount === 1) connected++; else check(false, `${key} has ${componentCount} components`);
  check(candidate.opaquePixels >= 170 && candidate.opaquePixels <= 310, `${key} density ${candidate.opaquePixels} is implausible for the slender Nymph chassis`); minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(elf.pixels)) elfDifferences++; else check(false, `${key} must differ from public Elf Mage`); if (candidate.alphaDigest !== elf.alphaDigest) elfAlphaDifferences++;
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(fairy.pixels)) fairyDifferences++; else check(false, `${key} must differ from approved Bramblewing Scout`); if (candidate.alphaDigest !== fairy.alphaDigest) fairyAlphaDifferences++;
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(grove.pixels)) groveDifferences++; else check(false, `${key} must differ from approved Grove Tender`); if (candidate.alphaDigest !== grove.alphaDigest) groveAlphaDifferences++;
  const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
  if (flash) { const colors = new Set(candidate.pixels.filter(Boolean)); check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be exact white flash`); flashes++; }
  else { for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, `${key} lost ${name} identity`); colored++; }
  check(candidate.renderResult.springDancerGate === EN_E06_SPRING_DANCER_GATE.id && candidate.renderResult.approvedPrecedingGate === EN_E06_BLOODCAP_REAVER_GATE.id, `${key} gate metadata drifted`);
  const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E06_SPRING_DANCER_DATA); completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0); formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) { check(JSON.stringify(captures.get(frameKey('left', animation.id, frame)).pixels) === JSON.stringify(mirrorPixels(captures.get(frameKey('right', animation.id, frame)).pixels)), `side mirror drifted ${animation.id}/${frame}`); check(captures.get(frameKey('down', animation.id, frame)).digest !== captures.get(frameKey('up', animation.id, frame)).digest, `Down/Up silhouette must differ ${animation.id}/${frame}`); }
for (const direction of directions) { for (let frame = 0; frame < 4; frame++) { check(JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels), `${direction} Cast alias drifted C${frame + 1}`); const source = EN_E06_SPRING_DANCER_DEATH_SOURCE_FRAMES[frame]; check(JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'hurt', source)).pixels), `${direction} Death alias drifted D${frame + 1}`); } check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2, `${direction} Idle must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4, `${direction} Walk must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4, `${direction} Attack must be distinct`); }

const candidateDigest = hashJson(candidateRecords), elfDigest = hashJson(elfRecords), fairyDigest = hashJson(fairyRecords), groveDigest = hashJson(groveRecords);
check(candidateDigest === EN_E06_SPRING_DANCER_GATE.candidateFrameDigest && elfDigest === EN_E06_SPRING_DANCER_GATE.elfMageComparisonDigest && fairyDigest === EN_E06_SPRING_DANCER_GATE.bramblewingScoutComparisonDigest && groveDigest === EN_E06_SPRING_DANCER_GATE.groveTenderComparisonDigest, 'candidate or comparison digest drifted');
check(elfDifferences === 80 && elfAlphaDifferences === 80 && fairyDifferences === 80 && fairyAlphaDifferences === 80 && groveDifferences === 80 && groveAlphaDifferences === 80 && connected === 80 && bounded === 80 && grounded === 80 && colored === 72 && flashes === 8, `suite totals drifted: Elf ${elfDifferences}/80 pixels ${elfAlphaDifferences}/80 alpha; Fairy ${fairyDifferences}/80 pixels ${fairyAlphaDifferences}/80 alpha; Grove ${groveDifferences}/80 pixels ${groveAlphaDifferences}/80 alpha; structure ${connected}/${bounded}/${grounded}; identity ${colored}/72 colored ${flashes}/8 flashes`);
check(completeB > 0 && formChanges > 0, 'Complete B/Form presentation must change pixels');
for (const [registry, family, variant, gate, candidateFamily] of approvedSuites) { const records = []; for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) records.push(frameRecord(captureEnemyExpansionFrame(registry, { kind: 'enemy', family, variant }, direction, animation.id, frame), family, variant, direction, animation.id, frame, candidateFamily)); check(hashJson(records) === gate.candidateFrameDigest, `approved ${variant} digest drifted`); }
for (const [artifact, expected] of [[EN_E06_SPRING_DANCER_GATE.artifact, EN_E06_SPRING_DANCER_GATE.artifactSha256], [EN_E06_SPRING_DANCER_GATE.assembledArtifact, EN_E06_SPRING_DANCER_GATE.assembledArtifactSha256], [EN_E06_SPRING_DANCER_GATE.comparisonArtifact, EN_E06_SPRING_DANCER_GATE.comparisonArtifactSha256], [EN_E06_SPRING_DANCER_GATE.reviewAnimations.raw.artifact, EN_E06_SPRING_DANCER_GATE.reviewAnimations.raw.sha256], [EN_E06_SPRING_DANCER_GATE.reviewAnimations.completeBForm.artifact, EN_E06_SPRING_DANCER_GATE.reviewAnimations.completeBForm.sha256]]) check(expected && await sha256File(artifact) === expected, `${artifact} hash drifted`);
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_SPRING_DANCER_REGISTRY, { kind: 'enemy', family: 'nymph', variant: 'mist-weaver' }, 'down', 'idle', 0, {}), 'Mist Weaver through isolated Spring Dancer registry');
for (const family of ['fairy', 'hag', 'dryad', 'redcap']) rejects(() => engine.renderEnemyExpansionFrame(EN_E06_SPRING_DANCER_REGISTRY, { kind: 'enemy', family, variant: 'planned' }, 'down', 'idle', 0, {}), family);
if (errors.length) { console.error('EN-E06 Nymph Spring Dancer focused validation failed:'); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log('EN-E06 Nymph Spring Dancer focused gate passed.');
console.log(`- Elf Mage distinction: ${elfDifferences}/80 pixel frames and ${elfAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Bramblewing Scout distinction: ${fairyDifferences}/80 pixel frames and ${fairyAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Grove Tender distinction: ${groveDifferences}/80 pixel frames and ${groveAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connected}/80 connected; ${bounded}/80 bounded; ${grounded}/80 grounded; opaque range ${minOpaque}-${maxOpaque}`);
console.log(`- Identity: ${colored}/72 colored hair-dress-ribbon frames; ${flashes}/8 exact white flashes`);
console.log(`- Presentation: Complete B +${completeB}; Form changes ${formChanges}`);
console.log('- Protected: all thirteen approved Fairy, Hag, Dryad, and Redcap sources exact; public 80/259; fixtures unchanged');
console.log(`- Candidate digest: ${candidateDigest}`);
