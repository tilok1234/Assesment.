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
import { EN_E06_CAULDRON_HEXER_CONTRACT, EN_E06_CAULDRON_HEXER_DATA, EN_E06_CAULDRON_HEXER_DEATH_SOURCE_FRAMES, EN_E06_CAULDRON_HEXER_FAMILY, EN_E06_CAULDRON_HEXER_GATE, EN_E06_CAULDRON_HEXER_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-cauldron-hexer.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = []; const check = (condition, message) => { if (!condition) errors.push(message); };
const directions = ['down', 'left', 'right', 'up'];
const animations = [{ id: 'idle', frames: 2 }, { id: 'walk', frames: 4 }, { id: 'attack', frames: 4 }, { id: 'cast', frames: 4 }, { id: 'hurt', frames: 2 }, { id: 'death', frames: 4 }];
const candidateSpec = { kind: 'enemy', family: 'hag', variant: 'cauldron-hexer' }; const mireSpec = { kind: 'enemy', family: 'hag', variant: 'mire-crone' };
const approvedFairies = [
  [EN_E06_FAIRY_REGISTRY, 'bramblewing-scout', EN_E06_FAIRY_GATE],
  [EN_E06_THISTLE_HEXER_REGISTRY, 'thistle-hexer', EN_E06_THISTLE_HEXER_GATE],
  [EN_E06_PETALCROWN_DUELIST_REGISTRY, 'petalcrown-duelist', EN_E06_PETALCROWN_DUELIST_GATE],
];
const frameKey = (direction, animation, frame) => `${direction}/${animation}/${frame}`;
const hashJson = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const record = (captured, variant, direction, animation, frame) => ({ family: 'hag', variant, candidateFamily: 'hag', direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });
const mireRecord = (captured, direction, animation, frame) => ({ family: 'hag', variant: 'mire-crone', direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });
const fairyRecord = (captured, variant, direction, animation, frame) => ({ family: 'fairy', variant, candidateFamily: 'fairy', direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });
function mirrorPixels(pixels) { const result = new Array(576).fill(null); for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) result[(y * 24) + (23 - x)] = pixels[(y * 24) + x]; return result; }
function components(pixels) { const seen = new Set(); let count = 0; for (let index = 0; index < 576; index++) { if (!pixels[index] || seen.has(index)) continue; count++; const queue = [index]; seen.add(index); while (queue.length) { const current = queue.pop(), x = current % 24; for (const neighbor of [current - 24, current + 24, x ? current - 1 : -1, x < 23 ? current + 1 : -1]) if (neighbor >= 0 && neighbor < 576 && pixels[neighbor] && !seen.has(neighbor)) { seen.add(neighbor); queue.push(neighbor); } } } return count; }
function countColors(pixels, colors) { return pixels.reduce((sum, color) => sum + (colors.has(color) ? 1 : 0), 0); }
async function sha256File(relativePath) { return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex'); }
function rejects(action, label) { try { action(); errors.push(`${label} must reject`); } catch (error) { check(String(error.message).includes('is not implemented'), `${label} rejected unexpectedly: ${error.message}`); } }

check(EN_E06_CAULDRON_HEXER_GATE.status === 'approved' && EN_E06_CAULDRON_HEXER_GATE.approvedOn === '2026-08-09', 'Cauldron Hexer must retain its explicit visual approval');
check(EN_E06_CAULDRON_HEXER_GATE.approvalEvidence.includes('approved lets do next') && EN_E06_CAULDRON_HEXER_GATE.approvalEvidence.includes('three exact PNGs were opened directly in Aseprite'), 'exact approval evidence drifted');
check(EN_E06_CAULDRON_HEXER_GATE.publishedImplementation === '4b59b4098caf6397719fba6d21c27c5f8dcd82b0', 'published implementation checkpoint drifted');
check(ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E06')?.gate === 'dryad-grove-tender-full-candidate-2026-08-09', 'ledger must preserve published Cauldron Hexer while identifying candidate Grove Tender');
check(EN_E06_CAULDRON_HEXER_GATE.authorizationEvidence.includes('designer said: next') && EN_E06_CAULDRON_HEXER_GATE.authorizationEvidence.includes('only this one complete 80-frame variant pass'), 'authorization evidence drifted');
check(EN_E06_CAULDRON_HEXER_GATE.precedingApproval.gateId === EN_E06_MIRE_CRONE_GATE.id && EN_E06_CAULDRON_HEXER_GATE.precedingApproval.publishedImplementation === EN_E06_MIRE_CRONE_GATE.publishedImplementation, 'approved Mire Crone predecessor drifted');
check(EN_E06_CAULDRON_HEXER_GATE.scope.includes('complete 80-frame Cauldron Hexer') && EN_E06_CAULDRON_HEXER_GATE.animationContract.includes('broad connected sweep'), 'full-suite or motion contract drifted');
check(EN_E06_CAULDRON_HEXER_GATE.exclusions.includes('changes to approved Mire Crone source or pixels') && EN_E06_CAULDRON_HEXER_GATE.exclusions.includes('Blackthorn Matron implementation') && EN_E06_CAULDRON_HEXER_GATE.exclusions.includes('cauldron geometry') && EN_E06_CAULDRON_HEXER_GATE.exclusions.includes('asset-pack fixture generation or regeneration'), 'scope exclusions drifted');
check(EN_E06_CAULDRON_HEXER_GATE.nextGate.includes('published at 4b59b4098caf6397719fba6d21c27c5f8dcd82b0') && EN_E06_CAULDRON_HEXER_GATE.nextGate.includes('Blackthorn Matron'), 'approved gate must retain publication and next-role authorization');
check(Object.isFrozen(EN_E06_CAULDRON_HEXER_GATE) && Object.isFrozen(EN_E06_CAULDRON_HEXER_DATA), 'gate and data must be deeply immutable');
check(EN_E06_CAULDRON_HEXER_CONTRACT.family === 'hag' && EN_E06_CAULDRON_HEXER_CONTRACT.variant === 'cauldron-hexer' && EN_E06_CAULDRON_HEXER_CONTRACT.role === 'specialist', 'candidate contract drifted');
check(EN_E06_CAULDRON_HEXER_CONTRACT.identity.includes('without baking in a cauldron') && EN_E06_CAULDRON_HEXER_CONTRACT.effectBoundary.includes('remain external'), 'specialist identity/effect boundary drifted');

check(EN_E06_CONTRACT_CARDS[0].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Fairies must remain approved');
check(EN_E06_CONTRACT_CARDS[1].variants.every(({ status }) => status === 'implemented-full-approved'), 'Hag role-order status drifted');
check(EN_E06_CONTRACT_CARDS[2].variants.map(({ status }) => status).join('/') === 'implemented-full-candidate/planned/planned', 'Dryad role-order status drifted');
for (const card of EN_E06_CONTRACT_CARDS.slice(3)) check(card.variants.every(({ status }) => status === 'planned'), `${card.id} must remain contract-only`);
check(EN_E06_CAULDRON_HEXER_REGISTRY.families.length === 1 && EN_E06_CAULDRON_HEXER_REGISTRY.publicFamilies.length === 0 && EN_E06_CAULDRON_HEXER_FAMILY.variants.length === 1, 'candidate registry boundary drifted');
const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 74 && publicVariantCount === 245 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'hag'), 'private specialist must retain public 74/245 with no Hag');
check(engine.EN_E06_CAULDRON_HEXER_REGISTRY === undefined, 'candidate must not leak through the facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8'), facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8'), manifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e06-hag-cauldron-hexer') && !facadeSource.includes('enemy-expansion-en-e06-hag-cauldron-hexer') && !manifest.includes('cauldron-hexer'), 'public or fixture firewall drifted');

const captures = new Map(), candidateRecords = [], mireRecords = [];
const palettes = ['skin', 'hair', 'shawl', 'dress', 'brew', 'copper'].map((name) => [name, new Set(EN_E06_CAULDRON_HEXER_DATA.cauldronHexer[name])]);
let connected = 0, bounded = 0, grounded = 0, colored = 0, flashes = 0, mireDifferences = 0, mireAlphaDifferences = 0, completeB = 0, formChanges = 0, minOpaque = Infinity, maxOpaque = 0;
for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame), candidate = captureEnemyExpansionFrame(EN_E06_CAULDRON_HEXER_REGISTRY, candidateSpec, direction, animation.id, frame), mire = captureEnemyExpansionFrame(EN_E06_MIRE_CRONE_REGISTRY, mireSpec, direction, animation.id, frame);
  captures.set(key, candidate); candidateRecords.push(record(candidate, 'cauldron-hexer', direction, animation.id, frame)); mireRecords.push(mireRecord(mire, direction, animation.id, frame));
  check(candidate.outOfBoundsWrites.length === 0 && candidate.alpha.every((value) => value === 0 || value === 255), `${key} must stay in-cell with hard alpha`);
  const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22; if (isBounded) bounded++; else check(false, `${key} lost one-cell margin`);
  const isGrounded = candidate.bounds && candidate.bounds.maxY >= 20 && candidate.bounds.maxY <= 22; if (isGrounded) grounded++; else check(false, `${key} lost ground contact`);
  const componentCount = components(candidate.pixels); if (componentCount === 1) connected++; else check(false, `${key} has ${componentCount} components`);
  check(candidate.opaquePixels >= 220 && candidate.opaquePixels <= 270, `${key} density ${candidate.opaquePixels} is implausible`); minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(mire.pixels)) mireDifferences++; else check(false, `${key} must differ from Mire Crone`); if (candidate.alphaDigest !== mire.alphaDigest) mireAlphaDifferences++;
  const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
  if (flash) { const colors = new Set(candidate.pixels.filter(Boolean)); check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be exact white flash`); flashes++; }
  else { for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, `${key} lost ${name} identity`); colored++; }
  check(candidate.renderResult.cauldronHexerGate === EN_E06_CAULDRON_HEXER_GATE.id && candidate.renderResult.approvedPrecedingGate === EN_E06_MIRE_CRONE_GATE.id, `${key} gate metadata drifted`);
  const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E06_CAULDRON_HEXER_DATA); completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0); formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) { check(JSON.stringify(captures.get(frameKey('left', animation.id, frame)).pixels) === JSON.stringify(mirrorPixels(captures.get(frameKey('right', animation.id, frame)).pixels)), `side mirror drifted ${animation.id}/${frame}`); check(captures.get(frameKey('down', animation.id, frame)).digest !== captures.get(frameKey('up', animation.id, frame)).digest, `Down/Up silhouette must differ ${animation.id}/${frame}`); }
for (const direction of directions) { for (let frame = 0; frame < 4; frame++) { check(JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels), `${direction} Cast alias drifted C${frame + 1}`); const source = EN_E06_CAULDRON_HEXER_DEATH_SOURCE_FRAMES[frame]; check(JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'hurt', source)).pixels), `${direction} Death alias drifted D${frame + 1}`); } check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2, `${direction} Idle must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4, `${direction} Walk must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4, `${direction} Attack must be distinct`); }

const candidateDigest = hashJson(candidateRecords), mireDigest = hashJson(mireRecords);
check(candidateDigest === EN_E06_CAULDRON_HEXER_GATE.candidateFrameDigest && mireDigest === EN_E06_CAULDRON_HEXER_GATE.mireCroneComparisonDigest, 'candidate or Mire digest drifted');
check(mireDifferences === 80 && mireAlphaDifferences === 80 && connected === 80 && bounded === 80 && grounded === 80 && colored === 72 && flashes === 8, `suite totals drifted: Mire ${mireDifferences}/80 pixels ${mireAlphaDifferences}/80 alpha; structure ${connected}/${bounded}/${grounded}; identity ${colored}/72 colored ${flashes}/8 flashes`);
check(completeB > 0 && formChanges > 0, 'Complete B/Form presentation must change pixels');
for (const [registry, variant, gate] of approvedFairies) { const records = []; for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) records.push(fairyRecord(captureEnemyExpansionFrame(registry, { kind: 'enemy', family: 'fairy', variant }, direction, animation.id, frame), variant, direction, animation.id, frame)); check(hashJson(records) === gate.candidateFrameDigest, `approved ${variant} digest drifted`); }
check(mireDigest === EN_E06_MIRE_CRONE_GATE.candidateFrameDigest, 'approved Mire Crone digest drifted');
for (const [artifact, expected] of [[EN_E06_CAULDRON_HEXER_GATE.artifact, EN_E06_CAULDRON_HEXER_GATE.artifactSha256], [EN_E06_CAULDRON_HEXER_GATE.assembledArtifact, EN_E06_CAULDRON_HEXER_GATE.assembledArtifactSha256], [EN_E06_CAULDRON_HEXER_GATE.comparisonArtifact, EN_E06_CAULDRON_HEXER_GATE.comparisonArtifactSha256], [EN_E06_CAULDRON_HEXER_GATE.reviewAnimations.raw.artifact, EN_E06_CAULDRON_HEXER_GATE.reviewAnimations.raw.sha256], [EN_E06_CAULDRON_HEXER_GATE.reviewAnimations.completeBForm.artifact, EN_E06_CAULDRON_HEXER_GATE.reviewAnimations.completeBForm.sha256]]) check(expected && await sha256File(artifact) === expected, `${artifact} hash drifted`);
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_CAULDRON_HEXER_REGISTRY, { kind: 'enemy', family: 'hag', variant: 'blackthorn-matron' }, 'down', 'idle', 0, {}), 'Blackthorn Matron'); for (const family of ['fairy', 'dryad', 'redcap', 'nymph']) rejects(() => engine.renderEnemyExpansionFrame(EN_E06_CAULDRON_HEXER_REGISTRY, { kind: 'enemy', family, variant: 'planned' }, 'down', 'idle', 0, {}), family);
if (errors.length) { console.error('EN-E06 Hag Cauldron Hexer focused validation failed:'); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log('EN-E06 Hag Cauldron Hexer focused gate passed.');
console.log(`- Mire distinction: ${mireDifferences}/80 pixel frames and ${mireAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connected}/80 connected; ${bounded}/80 bounded; ${grounded}/80 grounded; opaque range ${minOpaque}-${maxOpaque}`);
console.log(`- Identity: ${colored}/72 colored brewer frames; ${flashes}/8 exact white flashes`);
console.log(`- Presentation: Complete B +${completeB}; Form changes ${formChanges}`);
console.log('- Protected: all three Fairies and approved Mire Crone exact; public 74/245; fixtures unchanged');
console.log(`- Candidate digest: ${candidateDigest}`);
