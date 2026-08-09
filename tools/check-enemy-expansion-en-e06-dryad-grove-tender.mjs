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
import { EN_E06_GROVE_TENDER_CONTRACT, EN_E06_GROVE_TENDER_DATA, EN_E06_GROVE_TENDER_DEATH_SOURCE_FRAMES, EN_E06_GROVE_TENDER_FAMILY, EN_E06_GROVE_TENDER_GATE, EN_E06_GROVE_TENDER_REGISTRY } from '../engine/enemy-expansion-en-e06-dryad-grove-tender.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { alphaDigest, captureEnemyExpansionFrame, pixelDigest } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = []; const check = (condition, message) => { if (!condition) errors.push(message); };
const directions = ['down', 'left', 'right', 'up'];
const animations = [{ id: 'idle', frames: 2 }, { id: 'walk', frames: 4 }, { id: 'attack', frames: 4 }, { id: 'cast', frames: 4 }, { id: 'hurt', frames: 2 }, { id: 'death', frames: 4 }];
const candidateSpec = { kind: 'enemy', family: 'dryad', variant: 'grove-tender' };
const treantSpec = { kind: 'enemy', family: 'treant', variant: 'oak' };
const blackthornSpec = { kind: 'enemy', family: 'hag', variant: 'blackthorn-matron' };
const approvedSuites = [
  [EN_E06_FAIRY_REGISTRY, 'fairy', 'bramblewing-scout', EN_E06_FAIRY_GATE, true],
  [EN_E06_THISTLE_HEXER_REGISTRY, 'fairy', 'thistle-hexer', EN_E06_THISTLE_HEXER_GATE, true],
  [EN_E06_PETALCROWN_DUELIST_REGISTRY, 'fairy', 'petalcrown-duelist', EN_E06_PETALCROWN_DUELIST_GATE, true],
  [EN_E06_MIRE_CRONE_REGISTRY, 'hag', 'mire-crone', EN_E06_MIRE_CRONE_GATE, false],
  [EN_E06_CAULDRON_HEXER_REGISTRY, 'hag', 'cauldron-hexer', EN_E06_CAULDRON_HEXER_GATE, true],
  [EN_E06_BLACKTHORN_MATRON_REGISTRY, 'hag', 'blackthorn-matron', EN_E06_BLACKTHORN_MATRON_GATE, true],
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
  const pixels = new Array(576).fill(null), outOfBoundsWrites = [];
  let fillStyle = '#000000';
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

check(EN_E06_GROVE_TENDER_GATE.status === 'approved' && EN_E06_GROVE_TENDER_GATE.approvedOn === '2026-08-09' && EN_E06_GROVE_TENDER_GATE.publishedImplementation === '3d96fedc6127b09949befd06a5d177890f45dc05', 'Grove Tender approval record drifted');
check(EN_E06_GROVE_TENDER_GATE.approvalEvidence.includes('approved lets do nexrt') && EN_E06_GROVE_TENDER_GATE.approvalEvidence.includes('three exact PNG review boards were opened in Aseprite') && EN_E06_GROVE_TENDER_GATE.approvalEvidence.includes('one separately isolated complete Spore Cantor'), 'approval evidence drifted');
check(EN_E06_GROVE_TENDER_GATE.authorizationEvidence.includes('cool next please') && EN_E06_GROVE_TENDER_GATE.authorizationEvidence.includes('one complete common Grove Tender'), 'authorization evidence drifted');
check(EN_E06_GROVE_TENDER_GATE.precedingApproval.gateId === EN_E06_BLACKTHORN_MATRON_GATE.id && EN_E06_GROVE_TENDER_GATE.precedingApproval.publishedImplementation === EN_E06_BLACKTHORN_MATRON_GATE.publishedImplementation, 'approved Blackthorn Matron predecessor drifted');
check(EN_E06_GROVE_TENDER_GATE.scope.includes('complete 80-frame Grove Tender') && EN_E06_GROVE_TENDER_GATE.animationContract.includes('visibly forks'), 'full-suite or motion contract drifted');
check(EN_E06_GROVE_TENDER_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E06_GROVE_TENDER_GATE.exclusions.includes('Spore Cantor implementation') && EN_E06_GROVE_TENDER_GATE.exclusions.includes('detached leaves'), 'scope exclusions drifted');
check(EN_E06_GROVE_TENDER_GATE.nextGate.includes('only one complete Spore Cantor') && EN_E06_GROVE_TENDER_GATE.nextGate.includes('Heartwood Warden') && EN_E06_GROVE_TENDER_GATE.nextGate.includes('remain closed'), 'approved continuation gate drifted');
check(Object.isFrozen(EN_E06_GROVE_TENDER_GATE) && Object.isFrozen(EN_E06_GROVE_TENDER_DATA), 'gate and data must be deeply immutable');
check(EN_E06_GROVE_TENDER_CONTRACT.family === 'dryad' && EN_E06_GROVE_TENDER_CONTRACT.variant === 'grove-tender' && EN_E06_GROVE_TENDER_CONTRACT.role === 'common', 'candidate contract drifted');
check(EN_E06_GROVE_TENDER_CONTRACT.silhouette.includes('distinct from the broad trunk-bodied public Treant') && EN_E06_GROVE_TENDER_CONTRACT.effectBoundary.includes('remain external'), 'Dryad identity/effect boundary drifted');
check(ENEMY_EXPANSION_LEDGER.find(({ id }) => id === 'EN-E06')?.gate === 'eight-enemy-registration-authorized-2026-08-09', 'ledger must preserve published Grove Tender while recording the eight-enemy registration');

check(EN_E06_CONTRACT_CARDS[0].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Fairies must remain approved');
check(EN_E06_CONTRACT_CARDS[1].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Hags must remain approved');
check(EN_E06_CONTRACT_CARDS[2].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/implemented-full-approved/implemented-full-approved', 'Dryad role-order status drifted');
check(EN_E06_CONTRACT_CARDS[3].variants.map(({ status }) => status).join('/') === 'implemented-full-candidate/planned/planned', 'Redcap role-order status drifted');
check(EN_E06_CONTRACT_CARDS[4].variants.every(({ status }) => status === 'planned'), 'Nymph must remain contract-only');
check(EN_E06_GROVE_TENDER_REGISTRY.families.length === 1 && EN_E06_GROVE_TENDER_REGISTRY.publicFamilies.length === 0 && EN_E06_GROVE_TENDER_FAMILY.variants.length === 1, 'candidate registry boundary drifted');
const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 80 && publicVariantCount === 259 && engine.PUBLIC_ENEMIES.some(({ id }) => id === 'dryad'), 'the Dryad source must coexist with the later public 80/259 Dryad registration');
check(engine.EN_E06_GROVE_TENDER_REGISTRY === undefined, 'candidate must not leak through the facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8'), facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8'), manifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e06-dryad-grove-tender') && !facadeSource.includes('enemy-expansion-en-e06-dryad-grove-tender') && !manifest.includes('grove-tender'), 'public or fixture firewall drifted');

const captures = new Map(), candidateRecords = [], treantRecords = [], blackthornRecords = [];
const palettes = ['bark', 'crown', 'trunk', 'leaf', 'sapwood', 'blossom', 'branch'].map((name) => [name, new Set(EN_E06_GROVE_TENDER_DATA.groveTender[name])]);
let connected = 0, bounded = 0, grounded = 0, colored = 0, flashes = 0, treantDifferences = 0, treantAlphaDifferences = 0, blackthornDifferences = 0, blackthornAlphaDifferences = 0, completeB = 0, formChanges = 0, minOpaque = Infinity, maxOpaque = 0;
for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const candidate = captureEnemyExpansionFrame(EN_E06_GROVE_TENDER_REGISTRY, candidateSpec, direction, animation.id, frame);
  const treant = captureLegacyFrame(treantSpec, direction, animation.id, frame);
  const blackthorn = captureEnemyExpansionFrame(EN_E06_BLACKTHORN_MATRON_REGISTRY, blackthornSpec, direction, animation.id, frame);
  captures.set(key, candidate); candidateRecords.push(frameRecord(candidate, 'dryad', 'grove-tender', direction, animation.id, frame)); treantRecords.push(frameRecord(treant, 'treant', 'oak', direction, animation.id, frame, false)); blackthornRecords.push(frameRecord(blackthorn, 'hag', 'blackthorn-matron', direction, animation.id, frame));
  check(candidate.outOfBoundsWrites.length === 0 && candidate.alpha.every((value) => value === 0 || value === 255), `${key} must stay in-cell with hard alpha`);
  const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22; if (isBounded) bounded++; else check(false, `${key} lost one-cell margin`);
  const isGrounded = candidate.bounds && candidate.bounds.maxY >= 20 && candidate.bounds.maxY <= 22; if (isGrounded) grounded++; else check(false, `${key} lost ground contact`);
  const componentCount = components(candidate.pixels); if (componentCount === 1) connected++; else check(false, `${key} has ${componentCount} components`);
  check(candidate.opaquePixels >= 150 && candidate.opaquePixels <= 290, `${key} density ${candidate.opaquePixels} is implausible`); minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(treant.pixels)) treantDifferences++; else check(false, `${key} must differ from public Treant`); if (candidate.alphaDigest !== treant.alphaDigest) treantAlphaDifferences++;
  if (JSON.stringify(candidate.pixels) !== JSON.stringify(blackthorn.pixels)) blackthornDifferences++; else check(false, `${key} must differ from Blackthorn Matron`); if (candidate.alphaDigest !== blackthorn.alphaDigest) blackthornAlphaDifferences++;
  const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
  if (flash) { const colors = new Set(candidate.pixels.filter(Boolean)); check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be exact white flash`); flashes++; }
  else { for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, `${key} lost ${name} identity`); colored++; }
  check(candidate.renderResult.groveTenderGate === EN_E06_GROVE_TENDER_GATE.id && candidate.renderResult.approvedPrecedingGate === EN_E06_BLACKTHORN_MATRON_GATE.id, `${key} gate metadata drifted`);
  const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E06_GROVE_TENDER_DATA); completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0); formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) { check(JSON.stringify(captures.get(frameKey('left', animation.id, frame)).pixels) === JSON.stringify(mirrorPixels(captures.get(frameKey('right', animation.id, frame)).pixels)), `side mirror drifted ${animation.id}/${frame}`); check(captures.get(frameKey('down', animation.id, frame)).digest !== captures.get(frameKey('up', animation.id, frame)).digest, `Down/Up silhouette must differ ${animation.id}/${frame}`); }
for (const direction of directions) { for (let frame = 0; frame < 4; frame++) { check(JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels), `${direction} Cast alias drifted C${frame + 1}`); const source = EN_E06_GROVE_TENDER_DEATH_SOURCE_FRAMES[frame]; check(JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'hurt', source)).pixels), `${direction} Death alias drifted D${frame + 1}`); } check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2, `${direction} Idle must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4, `${direction} Walk must be distinct`); check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4, `${direction} Attack must be distinct`); }

const candidateDigest = hashJson(candidateRecords), treantDigest = hashJson(treantRecords), blackthornDigest = hashJson(blackthornRecords);
check(candidateDigest === EN_E06_GROVE_TENDER_GATE.candidateFrameDigest && treantDigest === EN_E06_GROVE_TENDER_GATE.treantComparisonDigest && blackthornDigest === EN_E06_GROVE_TENDER_GATE.blackthornMatronComparisonDigest, 'candidate or comparison digest drifted');
check(treantDifferences === 80 && treantAlphaDifferences === 80 && blackthornDifferences === 80 && blackthornAlphaDifferences === 80 && connected === 80 && bounded === 80 && grounded === 80 && colored === 72 && flashes === 8, `suite totals drifted: Treant ${treantDifferences}/80 pixels ${treantAlphaDifferences}/80 alpha; Blackthorn ${blackthornDifferences}/80 pixels ${blackthornAlphaDifferences}/80 alpha; structure ${connected}/${bounded}/${grounded}; identity ${colored}/72 colored ${flashes}/8 flashes`);
check(completeB > 0 && formChanges > 0, 'Complete B/Form presentation must change pixels');
for (const [registry, family, variant, gate, candidateFamily] of approvedSuites) { const records = []; for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) records.push(frameRecord(captureEnemyExpansionFrame(registry, { kind: 'enemy', family, variant }, direction, animation.id, frame), family, variant, direction, animation.id, frame, candidateFamily)); check(hashJson(records) === gate.candidateFrameDigest, `approved ${variant} digest drifted`); }
for (const [artifact, expected] of [[EN_E06_GROVE_TENDER_GATE.artifact, EN_E06_GROVE_TENDER_GATE.artifactSha256], [EN_E06_GROVE_TENDER_GATE.assembledArtifact, EN_E06_GROVE_TENDER_GATE.assembledArtifactSha256], [EN_E06_GROVE_TENDER_GATE.comparisonArtifact, EN_E06_GROVE_TENDER_GATE.comparisonArtifactSha256], [EN_E06_GROVE_TENDER_GATE.reviewAnimations.raw.artifact, EN_E06_GROVE_TENDER_GATE.reviewAnimations.raw.sha256], [EN_E06_GROVE_TENDER_GATE.reviewAnimations.completeBForm.artifact, EN_E06_GROVE_TENDER_GATE.reviewAnimations.completeBForm.sha256]]) check(expected && await sha256File(artifact) === expected, `${artifact} hash drifted`);
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_GROVE_TENDER_REGISTRY, { kind: 'enemy', family: 'dryad', variant: 'spore-cantor' }, 'down', 'idle', 0, {}), 'Spore Cantor'); for (const family of ['fairy', 'hag', 'redcap', 'nymph']) rejects(() => engine.renderEnemyExpansionFrame(EN_E06_GROVE_TENDER_REGISTRY, { kind: 'enemy', family, variant: 'planned' }, 'down', 'idle', 0, {}), family);
if (errors.length) { console.error('EN-E06 Dryad Grove Tender focused validation failed:'); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log('EN-E06 Dryad Grove Tender focused gate passed.');
console.log(`- Treant distinction: ${treantDifferences}/80 pixel frames and ${treantAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Blackthorn distinction: ${blackthornDifferences}/80 pixel frames and ${blackthornAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connected}/80 connected; ${bounded}/80 bounded; ${grounded}/80 grounded; opaque range ${minOpaque}-${maxOpaque}`);
console.log(`- Identity: ${colored}/72 colored living-wood frames; ${flashes}/8 exact white flashes`);
console.log(`- Presentation: Complete B +${completeB}; Form changes ${formChanges}`);
console.log('- Protected: all approved Fairy, Hag, and Dryad sources exact; public 80/259; fixtures unchanged');
console.log(`- Candidate digest: ${candidateDigest}`);
