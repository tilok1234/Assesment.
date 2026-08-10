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
import { EN_E06_SPRING_DANCER_GATE, EN_E06_SPRING_DANCER_REGISTRY } from '../engine/enemy-expansion-en-e06-nymph-spring-dancer.js';
import { EN_E06_MIST_WEAVER_CONTRACT, EN_E06_MIST_WEAVER_DATA, EN_E06_MIST_WEAVER_DEATH_SOURCE_FRAMES, EN_E06_MIST_WEAVER_FAMILY, EN_E06_MIST_WEAVER_GATE, EN_E06_MIST_WEAVER_REGISTRY } from '../engine/enemy-expansion-en-e06-nymph-mist-weaver.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { alphaDigest, captureEnemyExpansionFrame, pixelDigest } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = []; const check = (condition, message) => { if (!condition) errors.push(message); };
const directions = ['down', 'left', 'right', 'up'];
const animations = [{ id: 'idle', frames: 2 }, { id: 'walk', frames: 4 }, { id: 'attack', frames: 4 }, { id: 'cast', frames: 4 }, { id: 'hurt', frames: 2 }, { id: 'death', frames: 4 }];
const candidateSpec = { kind: 'enemy', family: 'nymph', variant: 'mist-weaver' };
const elfSpec = { kind: 'enemy', family: 'elf', variant: 'mage' };
const springSpec = { kind: 'enemy', family: 'nymph', variant: 'spring-dancer' };
const sporeSpec = { kind: 'enemy', family: 'dryad', variant: 'spore-cantor' };
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

check(EN_E06_MIST_WEAVER_GATE.status === 'candidate' && EN_E06_MIST_WEAVER_GATE.approvedOn === null && EN_E06_MIST_WEAVER_GATE.publishedImplementation === null, 'candidate preapproval state drifted');
check(EN_E06_MIST_WEAVER_GATE.authorizationEvidence.includes('designer said: lets do next') && EN_E06_MIST_WEAVER_GATE.authorizationEvidence.includes('only one private specialist Nymph Mist Weaver'), 'authorization evidence drifted');
check(EN_E06_MIST_WEAVER_GATE.baseCheckpoint === '6e63e95d5e6cf653ad37299766f10c3d3e3c0b2d', 'candidate base checkpoint drifted');
check(EN_E06_MIST_WEAVER_GATE.precedingApproval.gateId === EN_E06_SPRING_DANCER_GATE.id && EN_E06_MIST_WEAVER_GATE.precedingApproval.publishedImplementation === EN_E06_SPRING_DANCER_GATE.publishedImplementation && EN_E06_MIST_WEAVER_GATE.precedingApproval.publishedHandoff === '6e63e95d5e6cf653ad37299766f10c3d3e3c0b2d', 'approved Spring Dancer predecessor drifted');
check(EN_E06_MIST_WEAVER_GATE.scope.includes('complete 80-frame Mist Weaver specialist') && EN_E06_MIST_WEAVER_GATE.animationContract.includes('gathers both hands close') && EN_E06_MIST_WEAVER_GATE.animationContract.includes('outward release'), 'full-suite or motion contract drifted');
check(EN_E06_MIST_WEAVER_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E06_MIST_WEAVER_GATE.exclusions.includes('changes to approved Spring Dancer source or pixels') && EN_E06_MIST_WEAVER_GATE.exclusions.includes('Rivercrown Muse implementation'), 'scope exclusions drifted');
check(EN_E06_MIST_WEAVER_GATE.nextGate.includes('exact frozen Mist Weaver candidate review') && EN_E06_MIST_WEAVER_GATE.nextGate.includes('Do not commit') && EN_E06_MIST_WEAVER_GATE.nextGate.includes('explicitly approves'), 'preapproval stop gate drifted');
check(Object.isFrozen(EN_E06_MIST_WEAVER_GATE) && Object.isFrozen(EN_E06_MIST_WEAVER_DATA), 'gate and data must be deeply immutable');
check(EN_E06_MIST_WEAVER_CONTRACT.family === 'nymph' && EN_E06_MIST_WEAVER_CONTRACT.variant === 'mist-weaver' && EN_E06_MIST_WEAVER_CONTRACT.role === 'specialist', 'candidate contract drifted');
check(EN_E06_MIST_WEAVER_CONTRACT.silhouette.includes('face veil') && EN_E06_MIST_WEAVER_CONTRACT.silhouette.includes('bell sleeves') && EN_E06_MIST_WEAVER_CONTRACT.effectBoundary.includes('Mist') && EN_E06_MIST_WEAVER_CONTRACT.effectBoundary.includes('remain external'), 'Mist Weaver identity/effect boundary drifted');
check(ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E06')?.gate === 'eight-enemy-registration-authorized-2026-08-09', 'isolated candidate must not rewrite the approved registration ledger');
check(EN_E06_CONTRACT_CARDS[0].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Fairies must remain approved');
check(EN_E06_CONTRACT_CARDS[1].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Hags must remain approved');
check(EN_E06_CONTRACT_CARDS[2].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Dryads must remain approved');
check(EN_E06_CONTRACT_CARDS[3].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Redcaps must remain approved');
check(EN_E06_CONTRACT_CARDS[4].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/implemented-full-candidate/planned', 'Nymph role-order status drifted');
check(EN_E06_MIST_WEAVER_REGISTRY.families.length === 1 && EN_E06_MIST_WEAVER_REGISTRY.publicFamilies.length === 0 && EN_E06_MIST_WEAVER_FAMILY.variants.length === 1, 'candidate registry boundary drifted');
const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 80 && publicVariantCount === 259 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'nymph'), 'candidate must preserve public 80/259 and keep Nymph private');
check(engine.EN_E06_MIST_WEAVER_REGISTRY === undefined, 'candidate must not leak through the facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8'), facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8'), manifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e06-nymph-mist-weaver') && !facadeSource.includes('enemy-expansion-en-e06-nymph-mist-weaver') && !manifest.includes('mist-weaver'), 'public or fixture firewall drifted');

const captures = new Map(), candidateRecords = [], elfRecords = [], springRecords = [], sporeRecords = [];
const palettes = ['skin', 'hair', 'robe', 'veil', 'trim', 'silver', 'sandal'].map((name) => [name, new Set(EN_E06_MIST_WEAVER_DATA.mistWeaver[name])]);
let connected = 0, bounded = 0, grounded = 0, colored = 0, flashes = 0, elfDifferences = 0, elfAlphaDifferences = 0, springDifferences = 0, springAlphaDifferences = 0, sporeDifferences = 0, sporeAlphaDifferences = 0, completeB = 0, formChanges = 0, minOpaque = Infinity, maxOpaque = 0;
for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const candidate = captureEnemyExpansionFrame(EN_E06_MIST_WEAVER_REGISTRY, candidateSpec, direction, animation.id, frame);
  const elf = captureLegacyFrame(elfSpec, direction, animation.id, frame);
  const spring = captureEnemyExpansionFrame(EN_E06_SPRING_DANCER_REGISTRY, springSpec, direction, animation.id, frame);
  const spore = captureEnemyExpansionFrame(EN_E06_SPORE_CANTOR_REGISTRY, sporeSpec, direction, animation.id, frame);
  captures.set(key, candidate); candidateRecords.push(frameRecord(candidate, 'nymph', 'mist-weaver', direction, animation.id, frame)); elfRecords.push(frameRecord(elf, 'elf', 'mage', direction, animation.id, frame, false)); springRecords.push(frameRecord(spring, 'nymph', 'spring-dancer', direction, animation.id, frame)); sporeRecords.push(frameRecord(spore, 'dryad', 'spore-cantor', direction, animation.id, frame));
  check(candidate.outOfBoundsWrites.length === 0 && candidate.alpha.every((value) => value === 0 || value === 255), `${key} must stay in-cell with hard alpha`);
  if (candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22) bounded++; else check(false, `${key} lost one-cell margin`);
  if (candidate.bounds && candidate.bounds.maxY >= 20 && candidate.bounds.maxY <= 22) grounded++; else check(false, `${key} lost ground contact`);
  const componentCount = components(candidate.pixels); if (componentCount === 1) connected++; else check(false, `${key} has ${componentCount} components`);
  check(candidate.opaquePixels >= 230 && candidate.opaquePixels <= 390, `${key} density ${candidate.opaquePixels} is implausible for the veiled specialist chassis`); minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(elf.pixels)) elfDifferences++; if (candidate.alphaDigest !== elf.alphaDigest) elfAlphaDifferences++;
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(spring.pixels)) springDifferences++; if (candidate.alphaDigest !== spring.alphaDigest) springAlphaDifferences++;
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(spore.pixels)) sporeDifferences++; if (candidate.alphaDigest !== spore.alphaDigest) sporeAlphaDifferences++;
  const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
  if (flash) { const colors = new Set(candidate.pixels.filter(Boolean)); check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be exact white flash`); flashes++; }
  else { for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, `${key} lost ${name} identity`); colored++; }
  check(candidate.renderResult.mistWeaverGate === EN_E06_MIST_WEAVER_GATE.id && candidate.renderResult.approvedPrecedingGate === EN_E06_SPRING_DANCER_GATE.id, `${key} gate metadata drifted`);
  const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E06_MIST_WEAVER_DATA); completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0); formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) { check(JSON.stringify(captures.get(frameKey('left', animation.id, frame)).pixels) === JSON.stringify(mirrorPixels(captures.get(frameKey('right', animation.id, frame)).pixels)), `side mirror drifted ${animation.id}/${frame}`); check(captures.get(frameKey('down', animation.id, frame)).digest !== captures.get(frameKey('up', animation.id, frame)).digest, `Down/Up silhouette must differ ${animation.id}/${frame}`); }
for (const direction of directions) { for (let frame = 0; frame < 4; frame++) { check(JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels), `${direction} Cast alias drifted C${frame + 1}`); const source = EN_E06_MIST_WEAVER_DEATH_SOURCE_FRAMES[frame]; check(JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'hurt', source)).pixels), `${direction} Death alias drifted D${frame + 1}`); } check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2, `${direction} Idle must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4, `${direction} Walk must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4, `${direction} Attack must be distinct`); }

const candidateDigest = hashJson(candidateRecords), elfDigest = hashJson(elfRecords), springDigest = hashJson(springRecords), sporeDigest = hashJson(sporeRecords);
if (EN_E06_MIST_WEAVER_GATE.candidateFrameDigest) check(candidateDigest === EN_E06_MIST_WEAVER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E06_MIST_WEAVER_GATE.elfMageComparisonDigest) check(elfDigest === EN_E06_MIST_WEAVER_GATE.elfMageComparisonDigest, 'Elf Mage comparison digest drifted');
check(springDigest === EN_E06_MIST_WEAVER_GATE.springDancerComparisonDigest && sporeDigest === EN_E06_MIST_WEAVER_GATE.sporeCantorComparisonDigest, 'approved comparison digest drifted');
check(elfDifferences === 80 && elfAlphaDifferences === 80 && springDifferences === 80 && springAlphaDifferences === 80 && sporeDifferences === 80 && sporeAlphaDifferences === 80 && connected === 80 && bounded === 80 && grounded === 80 && colored === 72 && flashes === 8, `suite totals drifted: Elf ${elfDifferences}/${elfAlphaDifferences}; Spring ${springDifferences}/${springAlphaDifferences}; Spore ${sporeDifferences}/${sporeAlphaDifferences}; structure ${connected}/${bounded}/${grounded}; identity ${colored}/${flashes}`);
check(completeB > 0 && formChanges > 0, 'Complete B/Form presentation must change pixels');
for (const [registry, family, variant, gate, candidateFamily] of approvedSuites) { const records = []; for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) records.push(frameRecord(captureEnemyExpansionFrame(registry, { kind: 'enemy', family, variant }, direction, animation.id, frame), family, variant, direction, animation.id, frame, candidateFamily)); check(hashJson(records) === gate.candidateFrameDigest, `approved ${variant} digest drifted`); }
for (const [artifact, expected] of [[EN_E06_MIST_WEAVER_GATE.artifact, EN_E06_MIST_WEAVER_GATE.artifactSha256], [EN_E06_MIST_WEAVER_GATE.assembledArtifact, EN_E06_MIST_WEAVER_GATE.assembledArtifactSha256], [EN_E06_MIST_WEAVER_GATE.comparisonArtifact, EN_E06_MIST_WEAVER_GATE.comparisonArtifactSha256], [EN_E06_MIST_WEAVER_GATE.reviewAnimations.raw.artifact, EN_E06_MIST_WEAVER_GATE.reviewAnimations.raw.sha256], [EN_E06_MIST_WEAVER_GATE.reviewAnimations.completeBForm.artifact, EN_E06_MIST_WEAVER_GATE.reviewAnimations.completeBForm.sha256]]) if (expected) check(await sha256File(artifact) === expected, `${artifact} hash drifted`);
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_MIST_WEAVER_REGISTRY, { kind: 'enemy', family: 'nymph', variant: 'rivercrown-muse' }, 'down', 'idle', 0, {}), 'Rivercrown Muse through isolated Mist Weaver registry');
for (const family of ['fairy', 'hag', 'dryad', 'redcap']) rejects(() => engine.renderEnemyExpansionFrame(EN_E06_MIST_WEAVER_REGISTRY, { kind: 'enemy', family, variant: 'planned' }, 'down', 'idle', 0, {}), family);
if (errors.length) { console.error('EN-E06 Nymph Mist Weaver focused validation failed:'); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log('EN-E06 Nymph Mist Weaver focused gate passed.');
console.log(`- Elf Mage distinction: ${elfDifferences}/80 pixel frames and ${elfAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Spring Dancer distinction: ${springDifferences}/80 pixel frames and ${springAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Spore Cantor distinction: ${sporeDifferences}/80 pixel frames and ${sporeAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connected}/80 connected; ${bounded}/80 bounded; ${grounded}/80 grounded; opaque range ${minOpaque}-${maxOpaque}`);
console.log(`- Identity: ${colored}/72 colored cowl-veil-mantle frames; ${flashes}/8 exact white flashes`);
console.log(`- Presentation: Complete B +${completeB}; Form changes ${formChanges}`);
console.log('- Protected: all fourteen approved Fairy, Hag, Dryad, Redcap, and Spring Dancer sources exact; public 80/259; fixtures unchanged');
console.log(`- Candidate digest: ${candidateDigest}`);
console.log(`- Public Elf Mage digest: ${elfDigest}`);
