import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ENEMY_EXPANSION_PROFILE } from '../engine/enemy-expansion.js';
import { EN_E06_MIRE_CRONE_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-mire-crone.js';
import { EN_E06_CAULDRON_HEXER_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-cauldron-hexer.js';
import { EN_E06_BLACKTHORN_MATRON_DATA, EN_E06_BLACKTHORN_MATRON_GATE, EN_E06_BLACKTHORN_MATRON_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-blackthorn-matron.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame, encodeRgbaPng, hexToRgba } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e06-hag-blackthorn-matron');
const animationOutput = path.join(output, 'animation-frames');

const FONT = Object.freeze({
  ' ': [0, 0, 0, 0, 0, 0, 0], '+': [0, 4, 4, 31, 4, 4, 0], '-': [0, 0, 0, 31, 0, 0, 0], '/': [1, 2, 2, 4, 8, 8, 16],
  '0': [14, 17, 19, 21, 25, 17, 14], '1': [4, 12, 4, 4, 4, 4, 14], '2': [14, 17, 1, 2, 4, 8, 31], '3': [30, 1, 1, 14, 1, 1, 30],
  '4': [2, 6, 10, 18, 31, 2, 2], '5': [31, 16, 16, 30, 1, 1, 30], '6': [14, 16, 16, 30, 17, 17, 14], '7': [31, 1, 2, 4, 8, 8, 8],
  '8': [14, 17, 17, 14, 17, 17, 14], '9': [14, 17, 17, 15, 1, 1, 14],
  A: [14, 17, 17, 31, 17, 17, 17], B: [30, 17, 17, 30, 17, 17, 30], C: [15, 16, 16, 16, 16, 16, 15], D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31], F: [31, 16, 16, 30, 16, 16, 16], G: [15, 16, 16, 19, 17, 17, 15], H: [17, 17, 17, 31, 17, 17, 17],
  I: [31, 4, 4, 4, 4, 4, 31], J: [7, 2, 2, 2, 18, 18, 12], K: [17, 18, 20, 24, 20, 18, 17], L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17], N: [17, 25, 21, 19, 17, 17, 17], O: [14, 17, 17, 17, 17, 17, 14], P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13], R: [30, 17, 17, 30, 20, 18, 17], S: [15, 16, 16, 14, 1, 1, 30], T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 17, 21, 27, 17], X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4], Z: [31, 1, 2, 4, 8, 16, 31],
});
const COLORS = Object.freeze({ background: '#0b0f16', panel: '#141a24', panelAlt: '#111721', border: '#344052', title: '#e8ad63', candidate: '#63c79e', preceding: '#a9b86f', text: '#edf5ff', muted: '#9aa8b8', checkerA: '#202a37', checkerB: '#293646' });

class PixelCanvas {
  constructor(width, height) { this.width = width; this.height = height; this.rgba = Buffer.alloc(width * height * 4); }
  fillRect(x, y, width, height, fill) {
    if (![x, y, width, height].every(Number.isInteger) || x < 0 || y < 0 || width < 0 || height < 0 || x + width > this.width || y + height > this.height) throw new TypeError('Review rectangle is outside the PNG canvas.');
    const [red, green, blue, alpha] = hexToRgba(fill);
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { const offset = ((py * this.width) + px) * 4; this.rgba[offset] = red; this.rgba[offset + 1] = green; this.rgba[offset + 2] = blue; this.rgba[offset + 3] = alpha; }
  }
  textWidth(value, scale) { return Math.max(0, (value.length * 6 * scale) - scale); }
  drawText(value, x, y, scale, fill) {
    let cursor = x;
    for (const character of value.toUpperCase()) { const rows = FONT[character]; if (!rows) throw new TypeError(`Review font is missing glyph ${character}.`); for (let row = 0; row < rows.length; row++) for (let column = 0; column < 5; column++) if (rows[row] & (1 << (4 - column))) this.fillRect(cursor + (column * scale), y + (row * scale), scale, scale, fill); cursor += 6 * scale; }
  }
  drawCenteredText(value, centerX, y, scale, fill) { this.drawText(value, Math.round(centerX - (this.textWidth(value, scale) / 2)), y, scale, fill); }
  drawPixels(pixels, x, y, scale, border = true) {
    const size = ENEMY_EXPANSION_PROFILE.frameContract.cell;
    if (border) this.fillRect(x - 2, y - 2, (size * scale) + 4, (size * scale) + 4, COLORS.border);
    for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) this.fillRect(x + (px * scale), y + (py * scale), scale, scale, pixels[(py * size) + px] || ((px + py) % 2 === 0 ? COLORS.checkerA : COLORS.checkerB));
  }
}

const directions = Object.freeze(['down', 'left', 'right', 'up']);
const animations = Object.freeze([
  { id: 'idle', label: 'IDLE', prefix: 'F', frames: 2, sequence: [0, 1, 0, 1] },
  { id: 'walk', label: 'WALK', prefix: 'W', frames: 4, sequence: [0, 1, 2, 3] },
  { id: 'attack', label: 'ATTACK', prefix: 'A', frames: 4, sequence: [0, 1, 2, 3] },
  { id: 'cast', label: 'CAST', prefix: 'C', frames: 4, sequence: [0, 1, 2, 3] },
  { id: 'hurt', label: 'HURT', prefix: 'H', frames: 2, sequence: [0, 1, 0, 1] },
  { id: 'death', label: 'DEATH', prefix: 'D', frames: 4, sequence: [0, 1, 2, 3] },
]);
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'hag', variant: 'blackthorn-matron' });
const mireSpec = Object.freeze({ kind: 'enemy', family: 'hag', variant: 'mire-crone' });
const cauldronSpec = Object.freeze({ kind: 'enemy', family: 'hag', variant: 'cauldron-hexer' });
const captures = new Map(); const mireCaptures = new Map(); const cauldronCaptures = new Map();
const candidateFrames = []; const mireFrames = []; const cauldronFrames = [];
const key = (animation, direction, frame) => [animation, direction, frame].join('/');
const record = (captured, spec, direction, animation, frame) => ({ family: spec.family, variant: spec.variant, candidateFamily: 'hag', direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });
const mireRecord = (captured, direction, animation, frame) => ({ family: 'hag', variant: 'mire-crone', direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });
const cauldronRecord = (captured, direction, animation, frame) => ({ family: 'hag', variant: 'cauldron-hexer', candidateFamily: 'hag', direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const candidate = captureEnemyExpansionFrame(EN_E06_BLACKTHORN_MATRON_REGISTRY, candidateSpec, direction, animation.id, frame);
  const mire = captureEnemyExpansionFrame(EN_E06_MIRE_CRONE_REGISTRY, mireSpec, direction, animation.id, frame);
  const cauldron = captureEnemyExpansionFrame(EN_E06_CAULDRON_HEXER_REGISTRY, cauldronSpec, direction, animation.id, frame);
  captures.set(key(animation.id, direction, frame), candidate); mireCaptures.set(key(animation.id, direction, frame), mire); cauldronCaptures.set(key(animation.id, direction, frame), cauldron);
  candidateFrames.push(record(candidate, candidateSpec, direction, animation.id, frame)); mireFrames.push(mireRecord(mire, direction, animation.id, frame)); cauldronFrames.push(cauldronRecord(cauldron, direction, animation.id, frame));
}

function pixelsFor(animation, direction, frame, assembled) { const captured = captures.get(key(animation, direction, frame)); return assembled ? buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E06_BLACKTHORN_MATRON_DATA).formComplete : captured.pixels; }

function renderBoard({ title, subtitle, assembled }) {
  const margin = 16, labelWidth = 130, scale = 3, frameSize = 72, frameGap = 6, groupWidth = 306, directionGap = 14, headerHeight = 96, rowHeight = 108;
  const width = (margin * 2) + labelWidth + (groupWidth * directions.length) + (directionGap * 3); const height = headerHeight + (rowHeight * animations.length) + margin;
  const canvas = new PixelCanvas(width, height); const groupX = (index) => margin + labelWidth + (index * (groupWidth + directionGap));
  canvas.fillRect(0, 0, width, height, COLORS.background); canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel); canvas.drawText(title, margin, 14, 3, COLORS.title); canvas.drawText(subtitle, margin, 50, 1, COLORS.muted);
  for (let index = 0; index < directions.length; index++) canvas.drawCenteredText(directions[index], groupX(index) + (groupWidth / 2), 72, 2, COLORS.candidate);
  for (let row = 0; row < animations.length; row++) {
    const animation = animations[row], top = headerHeight + (row * rowHeight); canvas.fillRect(margin, top + 4, width - (margin * 2), rowHeight - 8, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt); canvas.fillRect(margin, top + 4, 5, rowHeight - 8, COLORS.candidate); canvas.drawText(animation.label, margin + 18, top + 30, 2, COLORS.text); canvas.drawText(animation.frames + ' FRAMES', margin + 18, top + 62, 1, COLORS.candidate);
    for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) { const actualWidth = (frameSize * animation.frames) + (frameGap * (animation.frames - 1)); const startX = Math.round(groupX(directionIndex) + ((groupWidth - actualWidth) / 2)); for (let frame = 0; frame < animation.frames; frame++) { const x = startX + (frame * (frameSize + frameGap)); canvas.drawPixels(pixelsFor(animation.id, directions[directionIndex], frame, assembled), x, top + 13, scale); canvas.drawCenteredText(animation.prefix + (frame + 1), x + 36, top + 91, 1, COLORS.muted); } }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

function renderComparisonBoard() {
  const samples = [{ animation: 'idle', frame: 0, label: 'IDLE F1' }, { animation: 'walk', frame: 2, label: 'WALK W3' }, { animation: 'attack', frame: 2, label: 'ATTACK A3' }, { animation: 'hurt', frame: 1, label: 'HURT H2' }];
  const width = 1192, height = 548, headerHeight = 96, labelWidth = 120, groupWidth = 260, rowHeight = 108; const canvas = new PixelCanvas(width, height);
  canvas.fillRect(0, 0, width, height, COLORS.background); canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel); canvas.drawText('EN-E06 HAG VARIANTS', 16, 14, 3, COLORS.title); canvas.drawText('APPROVED MIRE AND CAULDRON VS ISOLATED BLACKTHORN MATRON', 16, 50, 1, COLORS.muted);
  for (let index = 0; index < directions.length; index++) canvas.drawCenteredText(directions[index], labelWidth + (index * groupWidth) + (groupWidth / 2), 72, 2, COLORS.candidate);
  for (let row = 0; row < samples.length; row++) { const sample = samples[row], top = headerHeight + (row * rowHeight); canvas.fillRect(16, top + 4, width - 32, rowHeight - 8, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt); canvas.drawText(sample.label, 28, top + 30, 1, COLORS.text); for (let index = 0; index < directions.length; index++) { const x = labelWidth + (index * groupWidth); canvas.drawPixels(mireCaptures.get(key(sample.animation, directions[index], sample.frame)).pixels, x + 4, top + 12, 3); canvas.drawPixels(cauldronCaptures.get(key(sample.animation, directions[index], sample.frame)).pixels, x + 90, top + 12, 3); canvas.drawPixels(captures.get(key(sample.animation, directions[index], sample.frame)).pixels, x + 176, top + 12, 3); canvas.drawCenteredText('MIRE', x + 40, top + 90, 1, COLORS.preceding); canvas.drawCenteredText('HEXER', x + 126, top + 90, 1, COLORS.title); canvas.drawCenteredText('MATRON', x + 212, top + 90, 1, COLORS.candidate); } }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

function renderAnimationFrame(phase, assembled) {
  const width = 640, height = 672, headerHeight = 48, labelWidth = 112, cellWidth = 128, rowHeight = 104; const canvas = new PixelCanvas(width, height);
  canvas.fillRect(0, 0, width, height, COLORS.background); canvas.fillRect(0, 0, width, headerHeight, COLORS.panel); canvas.drawText('BLACKTHORN MATRON ' + (assembled ? 'COMPLETE B + FORM' : 'RAW'), 12, 6, 2, COLORS.title); canvas.drawText('PHASE ' + (phase + 1), 12, 30, 1, COLORS.candidate);
  for (let index = 0; index < directions.length; index++) canvas.drawCenteredText(directions[index], labelWidth + (index * cellWidth) + 64, 30, 1, COLORS.text);
  for (let row = 0; row < animations.length; row++) { const animation = animations[row], top = headerHeight + (row * rowHeight), frame = animation.sequence[phase]; canvas.fillRect(0, top, width, rowHeight, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt); canvas.fillRect(0, top, 5, rowHeight, COLORS.candidate); canvas.drawText(animation.label, 16, top + 38, 2, COLORS.text); for (let index = 0; index < directions.length; index++) { const x = labelWidth + (index * cellWidth); if (index > 0) canvas.fillRect(x, top, 1, rowHeight, COLORS.border); canvas.drawPixels(pixelsFor(animation.id, directions[index], frame, assembled), x + 28, top + 16, 3, false); canvas.drawCenteredText(animation.prefix + (frame + 1), x + 64, top + 88, 1, COLORS.muted); } }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

const rawBoard = renderBoard({ title: 'EN-E06 HAG BLACKTHORN MATRON FULL SUITE', subtitle: 'ONE COMPLETE ELITE HAG IDLE WALK ATTACK CAST HURT DEATH', assembled: false });
const assembledBoard = renderBoard({ title: 'EN-E06 BLACKTHORN MATRON COMPLETE B + FORM', subtitle: 'SAME CONNECTED BRIAR ARMORED HAG WITH APPROVED PRESENTATION', assembled: true });
const comparisonBoard = renderComparisonBoard();
const rawHash = createHash('sha256').update(rawBoard.png).digest('hex'), assembledHash = createHash('sha256').update(assembledBoard.png).digest('hex'), comparisonHash = createHash('sha256').update(comparisonBoard.png).digest('hex');
const candidateFrameDigest = createHash('sha256').update(JSON.stringify(candidateFrames)).digest('hex'), mireFrameDigest = createHash('sha256').update(JSON.stringify(mireFrames)).digest('hex'), cauldronFrameDigest = createHash('sha256').update(JSON.stringify(cauldronFrames)).digest('hex');
const drift = [];
if (EN_E06_BLACKTHORN_MATRON_GATE.artifactSha256 && rawHash !== EN_E06_BLACKTHORN_MATRON_GATE.artifactSha256) drift.push('raw review drift');
if (EN_E06_BLACKTHORN_MATRON_GATE.assembledArtifactSha256 && assembledHash !== EN_E06_BLACKTHORN_MATRON_GATE.assembledArtifactSha256) drift.push('assembled review drift');
if (EN_E06_BLACKTHORN_MATRON_GATE.comparisonArtifactSha256 && comparisonHash !== EN_E06_BLACKTHORN_MATRON_GATE.comparisonArtifactSha256) drift.push('comparison review drift');
if (EN_E06_BLACKTHORN_MATRON_GATE.candidateFrameDigest && candidateFrameDigest !== EN_E06_BLACKTHORN_MATRON_GATE.candidateFrameDigest) drift.push('candidate digest drift');
if (EN_E06_BLACKTHORN_MATRON_GATE.mireCroneComparisonDigest && mireFrameDigest !== EN_E06_BLACKTHORN_MATRON_GATE.mireCroneComparisonDigest) drift.push('approved Mire Crone digest drift');
if (EN_E06_BLACKTHORN_MATRON_GATE.cauldronHexerComparisonDigest && cauldronFrameDigest !== EN_E06_BLACKTHORN_MATRON_GATE.cauldronHexerComparisonDigest) drift.push('approved Cauldron Hexer digest drift');
if (drift.length) throw new Error('EN-E06 Blackthorn Matron evidence drifted: ' + drift.join(', '));

const report = { format: 'enemy-expansion-en-e06-hag-blackthorn-matron-full-v1', sliceId: 'EN-E06', state: EN_E06_BLACKTHORN_MATRON_GATE.status, candidate: candidateSpec, comparison: [mireSpec, cauldronSpec], artifact: path.basename(EN_E06_BLACKTHORN_MATRON_GATE.artifact), png: { width: rawBoard.width, height: rawBoard.height, sha256: rawHash }, assembledArtifact: path.basename(EN_E06_BLACKTHORN_MATRON_GATE.assembledArtifact), assembledPng: { width: assembledBoard.width, height: assembledBoard.height, sha256: assembledHash }, comparisonArtifact: path.basename(EN_E06_BLACKTHORN_MATRON_GATE.comparisonArtifact), comparisonPng: { width: comparisonBoard.width, height: comparisonBoard.height, sha256: comparisonHash }, animationFrames: { raw: [1, 2, 3, 4].map((frame) => `animation-frames/raw-${frame}.png`), completeBForm: [1, 2, 3, 4].map((frame) => `animation-frames/complete-b-form-${frame}.png`), width: 640, height: 672, frameDurationMs: 180 }, candidateFrameDigest, mireFrameDigest, cauldronFrameDigest, authorization: EN_E06_BLACKTHORN_MATRON_GATE, candidateFrames, mireFrames, cauldronFrames, guarantees: { candidateFamilies: 1, candidateVariants: 1, candidateFrames: 80, publicCandidateFamilies: 0, animationsRendered: animations.map(({ id }) => id), directions, binaryAlpha: true, publicRegistrationApplied: false, effectBoundary: EN_E06_BLACKTHORN_MATRON_DATA.effectBoundary, effects: 'off', assembledPresentation: ['Complete B', 'Form'] } };

await mkdir(animationOutput, { recursive: true });
await writeFile(path.join(output, report.artifact), rawBoard.png); await writeFile(path.join(output, report.assembledArtifact), assembledBoard.png); await writeFile(path.join(output, report.comparisonArtifact), comparisonBoard.png);
for (let phase = 0; phase < 4; phase++) { await writeFile(path.join(animationOutput, `raw-${phase + 1}.png`), renderAnimationFrame(phase, false).png); await writeFile(path.join(animationOutput, `complete-b-form-${phase + 1}.png`), renderAnimationFrame(phase, true).png); }
await writeFile(path.join(output, 'en-e06-hag-blackthorn-matron-full-review.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log('Generated the bounded EN-E06 Hag Blackthorn Matron full-enemy evidence.');
console.log(`- Raw PNG SHA-256: ${rawHash}`); console.log(`- Complete B + Form PNG SHA-256: ${assembledHash}`); console.log(`- Hag comparison PNG SHA-256: ${comparisonHash}`); console.log(`- Candidate frame digest: ${candidateFrameDigest}`); console.log(`- Approved Mire Crone frame digest: ${mireFrameDigest}`); console.log(`- Approved Cauldron Hexer frame digest: ${cauldronFrameDigest}`);
