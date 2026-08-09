import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { ENEMY_EXPANSION_LEDGER } from '../engine/enemy-expansion.js';
import { EN_E06_CONTRACT_CARDS } from '../engine/enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_FAIRY_GATE, EN_E06_FAIRY_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy.js';
import { EN_E06_THISTLE_HEXER_GATE, EN_E06_THISTLE_HEXER_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy-thistle-hexer.js';
import { EN_E06_PETALCROWN_DUELIST_GATE, EN_E06_PETALCROWN_DUELIST_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy-petalcrown-duelist.js';
import { EN_E06_MIRE_CRONE_GATE, EN_E06_MIRE_CRONE_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-mire-crone.js';
import { EN_E06_CAULDRON_HEXER_GATE, EN_E06_CAULDRON_HEXER_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-cauldron-hexer.js';
import { EN_E06_BLACKTHORN_MATRON_CONTRACT, EN_E06_BLACKTHORN_MATRON_DATA, EN_E06_BLACKTHORN_MATRON_DEATH_SOURCE_FRAMES, EN_E06_BLACKTHORN_MATRON_FAMILY, EN_E06_BLACKTHORN_MATRON_GATE, EN_E06_BLACKTHORN_MATRON_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-blackthorn-matron.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = []; const check = (condition, message) => { if (!condition) errors.push(message); };
const directions = ['down', 'left', 'right', 'up'];
const animations = [{ id: 'idle', frames: 2 }, { id: 'walk', frames: 4 }, { id: 'attack', frames: 4 }, { id: 'cast', frames: 4 }, { id: 'hurt', frames: 2 }, { id: 'death', frames: 4 }];
const candidateSpec = { kind: 'enemy', family: 'hag', variant: 'blackthorn-matron' };
const mireSpec = { kind: 'enemy', family: 'hag', variant: 'mire-crone' };
const cauldronSpec = { kind: 'enemy', family: 'hag', variant: 'cauldron-hexer' };
const approvedFairies = [
  [EN_E06_FAIRY_REGISTRY, 'bramblewing-scout', EN_E06_FAIRY_GATE],
  [EN_E06_THISTLE_HEXER_REGISTRY, 'thistle-hexer', EN_E06_THISTLE_HEXER_GATE],
  [EN_E06_PETALCROWN_DUELIST_REGISTRY, 'petalcrown-duelist', EN_E06_PETALCROWN_DUELIST_GATE],
];
const frameKey = (direction, animation, frame) => `${direction}/${animation}/${frame}`;
const hashJson = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hagRecord = (captured, variant, direction, animation, frame, candidateFamily = true) => ({ family: 'hag', variant, ...(candidateFamily ? { candidateFamily: 'hag' } : {}), direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });
const fairyRecord = (captured, variant, direction, animation, frame) => ({ family: 'fairy', variant, candidateFamily: 'fairy', direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });
function mirrorPixels(pixels) { const result = new Array(576).fill(null); for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) result[(y * 24) + (23 - x)] = pixels[(y * 24) + x]; return result; }
function components(pixels) { const seen = new Set(); let count = 0; for (let index = 0; index < 576; index++) { if (!pixels[index] || seen.has(index)) continue; count++; const queue = [index]; seen.add(index); while (queue.length) { const current = queue.pop(), x = current % 24; for (const neighbor of [current - 24, current + 24, x ? current - 1 : -1, x < 23 ? current + 1 : -1]) if (neighbor >= 0 && neighbor < 576 && pixels[neighbor] && !seen.has(neighbor)) { seen.add(neighbor); queue.push(neighbor); } } } return count; }
function countColors(pixels, colors) { return pixels.reduce((sum, color) => sum + (colors.has(color) ? 1 : 0), 0); }
async function sha256File(relativePath) { return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex'); }
function rejects(action, label) { try { action(); errors.push(`${label} must reject`); } catch (error) { check(String(error.message).includes('is not implemented'), `${label} rejected unexpectedly: ${error.message}`); } }

check(EN_E06_BLACKTHORN_MATRON_GATE.status === 'candidate' && EN_E06_BLACKTHORN_MATRON_GATE.approvedOn === null && EN_E06_BLACKTHORN_MATRON_GATE.publishedImplementation === null, 'Blackthorn Matron must remain an unpublished visual candidate');
check(EN_E06_BLACKTHORN_MATRON_GATE.authorizationEvidence.includes('approved lets do next') && EN_E06_BLACKTHORN_MATRON_GATE.authorizationEvidence.includes('one complete Blackthorn Matron'), 'authorization evidence drifted');
check(EN_E06_BLACKTHORN_MATRON_GATE.precedingApproval.gateId === EN_E06_CAULDRON_HEXER_GATE.id && EN_E06_BLACKTHORN_MATRON_GATE.precedingApproval.publishedImplementation === EN_E06_CAULDRON_HEXER_GATE.publishedImplementation, 'approved Cauldron Hexer predecessor drifted');
check(EN_E06_BLACKTHORN_MATRON_GATE.scope.includes('complete 80-frame Blackthorn Matron') && EN_E06_BLACKTHORN_MATRON_GATE.animationContract.includes('broad reinforced claw rake'), 'full-suite or motion contract drifted');
check(EN_E06_BLACKTHORN_MATRON_GATE.exclusions.includes('changes to approved Cauldron Hexer source or pixels') && EN_E06_BLACKTHORN_MATRON_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E06_BLACKTHORN_MATRON_GATE.exclusions.includes('detached thorns'), 'scope exclusions drifted');
check(EN_E06_BLACKTHORN_MATRON_GATE.nextGate.includes('explicit visual approval') && EN_E06_BLACKTHORN_MATRON_GATE.nextGate.includes('Do not commit'), 'candidate stop gate drifted');
check(Object.isFrozen(EN_E06_BLACKTHORN_MATRON_GATE) && Object.isFrozen(EN_E06_BLACKTHORN_MATRON_DATA), 'gate and data must be deeply immutable');
check(EN_E06_BLACKTHORN_MATRON_CONTRACT.family === 'hag' && EN_E06_BLACKTHORN_MATRON_CONTRACT.variant === 'blackthorn-matron' && EN_E06_BLACKTHORN_MATRON_CONTRACT.role === 'elite', 'candidate contract drifted');
check(EN_E06_BLACKTHORN_MATRON_CONTRACT.identity.includes('asymmetrical thorn crown') && EN_E06_BLACKTHORN_MATRON_CONTRACT.effectBoundary.includes('remain external'), 'elite identity/effect boundary drifted');
check(ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E06')?.gate === 'hag-blackthorn-matron-full-candidate-2026-08-09', 'ledger must identify the isolated Blackthorn Matron candidate');

check(EN_E06_CONTRACT_CARDS[0].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Fairies must remain approved');
check(EN_E06_CONTRACT_CARDS[1].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/implemented-full-approved/implemented-full-candidate', 'Hag role-order status drifted');
for (const card of EN_E06_CONTRACT_CARDS.slice(2)) check(card.variants.every(({ status }) => status === 'planned'), `${card.id} must remain contract-only`);
check(EN_E06_BLACKTHORN_MATRON_REGISTRY.families.length === 1 && EN_E06_BLACKTHORN_MATRON_REGISTRY.publicFamilies.length === 0 && EN_E06_BLACKTHORN_MATRON_FAMILY.variants.length === 1, 'candidate registry boundary drifted');
const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 74 && publicVariantCount === 245 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'hag'), 'private elite must retain public 74/245 with no Hag');
check(engine.EN_E06_BLACKTHORN_MATRON_REGISTRY === undefined, 'candidate must not leak through the facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8'), facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8'), manifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e06-hag-blackthorn-matron') && !facadeSource.includes('enemy-expansion-en-e06-hag-blackthorn-matron') && !manifest.includes('blackthorn-matron'), 'public or fixture firewall drifted');

const captures = new Map(), candidateRecords = [], mireRecords = [], cauldronRecords = [];
const palettes = ['skin', 'hair', 'shawl', 'dress', 'briar', 'thorn', 'claw'].map((name) => [name, new Set(EN_E06_BLACKTHORN_MATRON_DATA.blackthornMatron[name])]);
let connected = 0, bounded = 0, grounded = 0, colored = 0, flashes = 0, mireDifferences = 0, mireAlphaDifferences = 0, cauldronDifferences = 0, cauldronAlphaDifferences = 0, completeB = 0, formChanges = 0, minOpaque = Infinity, maxOpaque = 0;
for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const candidate = captureEnemyExpansionFrame(EN_E06_BLACKTHORN_MATRON_REGISTRY, candidateSpec, direction, animation.id, frame);
  const mire = captureEnemyExpansionFrame(EN_E06_MIRE_CRONE_REGISTRY, mireSpec, direction, animation.id, frame);
  const cauldron = captureEnemyExpansionFrame(EN_E06_CAULDRON_HEXER_REGISTRY, cauldronSpec, direction, animation.id, frame);
  captures.set(key, candidate); candidateRecords.push(hagRecord(candidate, 'blackthorn-matron', direction, animation.id, frame)); mireRecords.push(hagRecord(mire, 'mire-crone', direction, animation.id, frame, false)); cauldronRecords.push(hagRecord(cauldron, 'cauldron-hexer', direction, animation.id, frame));
  check(candidate.outOfBoundsWrites.length === 0 && candidate.alpha.every((value) => value === 0 || value === 255), `${key} must stay in-cell with hard alpha`);
  const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22; if (isBounded) bounded++; else check(false, `${key} lost one-cell margin`);
  const isGrounded = candidate.bounds && candidate.bounds.maxY >= 20 && candidate.bounds.maxY <= 22; if (isGrounded) grounded++; else check(false, `${key} lost ground contact`);
  const componentCount = components(candidate.pixels); if (componentCount === 1) connected++; else check(false, `${key} has ${componentCount} components`);
  check(candidate.opaquePixels >= 220 && candidate.opaquePixels <= 290, `${key} density ${candidate.opaquePixels} is implausible`); minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(mire.pixels)) mireDifferences++; else check(false, `${key} must differ from Mire Crone`); if (candidate.alphaDigest !== mire.alphaDigest) mireAlphaDifferences++;
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(cauldron.pixels)) cauldronDifferences++; else check(false, `${key} must differ from Cauldron Hexer`); if (candidate.alphaDigest !== cauldron.alphaDigest) cauldronAlphaDifferences++;
  const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
  if (flash) { const colors = new Set(candidate.pixels.filter(Boolean)); check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be exact white flash`); flashes++; }
  else { for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, `${key} lost ${name} identity`); colored++; }
  check(candidate.renderResult.blackthornMatronGate === EN_E06_BLACKTHORN_MATRON_GATE.id && candidate.renderResult.approvedPrecedingGate === EN_E06_CAULDRON_HEXER_GATE.id, `${key} gate metadata drifted`);
  const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E06_BLACKTHORN_MATRON_DATA); completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0); formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) { check(JSON.stringify(captures.get(frameKey('left', animation.id, frame)).pixels) === JSON.stringify(mirrorPixels(captures.get(frameKey('right', animation.id, frame)).pixels)), `side mirror drifted ${animation.id}/${frame}`); check(captures.get(frameKey('down', animation.id, frame)).digest !== captures.get(frameKey('up', animation.id, frame)).digest, `Down/Up silhouette must differ ${animation.id}/${frame}`); }
for (const direction of directions) { for (let frame = 0; frame < 4; frame++) { check(JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels), `${direction} Cast alias drifted C${frame + 1}`); const source = EN_E06_BLACKTHORN_MATRON_DEATH_SOURCE_FRAMES[frame]; check(JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'hurt', source)).pixels), `${direction} Death alias drifted D${frame + 1}`); } check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2, `${direction} Idle must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4, `${direction} Walk must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4, `${direction} Attack must be distinct`); }

const candidateDigest = hashJson(candidateRecords), mireDigest = hashJson(mireRecords), cauldronDigest = hashJson(cauldronRecords);
check(candidateDigest === EN_E06_BLACKTHORN_MATRON_GATE.candidateFrameDigest && mireDigest === EN_E06_BLACKTHORN_MATRON_GATE.mireCroneComparisonDigest && cauldronDigest === EN_E06_BLACKTHORN_MATRON_GATE.cauldronHexerComparisonDigest, 'candidate or approved Hag digest drifted');
check(mireDifferences === 80 && mireAlphaDifferences === 80 && cauldronDifferences === 80 && cauldronAlphaDifferences === 80 && connected === 80 && bounded === 80 && grounded === 80 && colored === 72 && flashes === 8, `suite totals drifted: Mire ${mireDifferences}/80 pixels ${mireAlphaDifferences}/80 alpha; Cauldron ${cauldronDifferences}/80 pixels ${cauldronAlphaDifferences}/80 alpha; structure ${connected}/${bounded}/${grounded}; identity ${colored}/72 colored ${flashes}/8 flashes`);
check(completeB > 0 && formChanges > 0, 'Complete B/Form presentation must change pixels');
for (const [registry, variant, gate] of approvedFairies) { const records = []; for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) records.push(fairyRecord(captureEnemyExpansionFrame(registry, { kind: 'enemy', family: 'fairy', variant }, direction, animation.id, frame), variant, direction, animation.id, frame)); check(hashJson(records) === gate.candidateFrameDigest, `approved ${variant} digest drifted`); }
check(mireDigest === EN_E06_MIRE_CRONE_GATE.candidateFrameDigest, 'approved Mire Crone digest drifted');
check(cauldronDigest === EN_E06_CAULDRON_HEXER_GATE.candidateFrameDigest, 'approved Cauldron Hexer digest drifted');
for (const [artifact, expected] of [[EN_E06_BLACKTHORN_MATRON_GATE.artifact, EN_E06_BLACKTHORN_MATRON_GATE.artifactSha256], [EN_E06_BLACKTHORN_MATRON_GATE.assembledArtifact, EN_E06_BLACKTHORN_MATRON_GATE.assembledArtifactSha256], [EN_E06_BLACKTHORN_MATRON_GATE.comparisonArtifact, EN_E06_BLACKTHORN_MATRON_GATE.comparisonArtifactSha256], [EN_E06_BLACKTHORN_MATRON_GATE.reviewAnimations.raw.artifact, EN_E06_BLACKTHORN_MATRON_GATE.reviewAnimations.raw.sha256], [EN_E06_BLACKTHORN_MATRON_GATE.reviewAnimations.completeBForm.artifact, EN_E06_BLACKTHORN_MATRON_GATE.reviewAnimations.completeBForm.sha256]]) check(expected && await sha256File(artifact) === expected, `${artifact} hash drifted`);
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_BLACKTHORN_MATRON_REGISTRY, { kind: 'enemy', family: 'hag', variant: 'cauldron-hexer' }, 'down', 'idle', 0, {}), 'Cauldron Hexer'); for (const family of ['fairy', 'dryad', 'redcap', 'nymph']) rejects(() => engine.renderEnemyExpansionFrame(EN_E06_BLACKTHORN_MATRON_REGISTRY, { kind: 'enemy', family, variant: 'planned' }, 'down', 'idle', 0, {}), family);
if (errors.length) { console.error('EN-E06 Hag Blackthorn Matron focused validation failed:'); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log('EN-E06 Hag Blackthorn Matron focused gate passed.');
console.log(`- Mire distinction: ${mireDifferences}/80 pixel frames and ${mireAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Cauldron distinction: ${cauldronDifferences}/80 pixel frames and ${cauldronAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connected}/80 connected; ${bounded}/80 bounded; ${grounded}/80 grounded; opaque range ${minOpaque}-${maxOpaque}`);
console.log(`- Identity: ${colored}/72 colored briar frames; ${flashes}/8 exact white flashes`);
console.log(`- Presentation: Complete B +${completeB}; Form changes ${formChanges}`);
console.log('- Protected: all three Fairies and both approved Hags exact; public 74/245; fixtures unchanged');
console.log(`- Candidate digest: ${candidateDigest}`);
