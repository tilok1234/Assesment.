import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ENEMY_EXPANSION_PROFILE } from '../engine/enemy-expansion.js';
import { EN_E10_TUNDRAHIDE_GRAZER_REGISTRY } from '../engine/enemy-expansion-en-e10-mammoth-tundrahide-grazer.js';
import { EN_E10_CLIFFCOIL_STRIDER_REGISTRY } from '../engine/enemy-expansion-en-e10-ram-cliffcoil-strider.js';
import {
  EN_E10_FROSTVEIN_WAYFINDER_DATA,
  EN_E10_FROSTVEIN_WAYFINDER_GATE,
  EN_E10_FROSTVEIN_WAYFINDER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-mammoth-frostvein-wayfinder.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { alphaDigest, captureEnemyExpansionFrame, encodeRgbaPng, hexToRgba, pixelDigest } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e10-mammoth-frostvein-wayfinder');
const animationOutput = path.join(output, 'animation-frames');
const FONT = Object.freeze({
  ' ': [0,0,0,0,0,0,0], '+': [0,4,4,31,4,4,0], '-': [0,0,0,31,0,0,0], '/': [1,2,2,4,8,8,16],
  '0': [14,17,19,21,25,17,14], '1': [4,12,4,4,4,4,14], '2': [14,17,1,2,4,8,31], '3': [30,1,1,14,1,1,30], '4': [2,6,10,18,31,2,2], '5': [31,16,16,30,1,1,30], '6': [14,16,16,30,17,17,14], '7': [31,1,2,4,8,8,8], '8': [14,17,17,14,17,17,14], '9': [14,17,17,15,1,1,14],
  A: [14,17,17,31,17,17,17], B: [30,17,17,30,17,17,30], C: [15,16,16,16,16,16,15], D: [30,17,17,17,17,17,30], E: [31,16,16,30,16,16,31], F: [31,16,16,30,16,16,16], G: [15,16,16,19,17,17,15], H: [17,17,17,31,17,17,17], I: [31,4,4,4,4,4,31], J: [7,2,2,2,18,18,12], K: [17,18,20,24,20,18,17], L: [16,16,16,16,16,16,31], M: [17,27,21,21,17,17,17], N: [17,25,21,19,17,17,17], O: [14,17,17,17,17,17,14], P: [30,17,17,30,16,16,16], Q: [14,17,17,17,21,18,13], R: [30,17,17,30,20,18,17], S: [15,16,16,14,1,1,30], T: [31,4,4,4,4,4,4], U: [17,17,17,17,17,17,14], V: [17,17,17,17,17,10,4], W: [17,17,17,17,21,27,17], X: [17,17,10,4,10,17,17], Y: [17,17,10,4,4,4,4], Z: [31,1,2,4,8,16,31],
});
const COLORS = Object.freeze({ background: '#0b0f16', panel: '#141a24', panelAlt: '#111721', border: '#344052', title: '#c7d8df', candidate: '#63d5dc', preceding: '#d7c59f', text: '#edf5ff', muted: '#9aa8b8', checkerA: '#202a37', checkerB: '#293646' });

class PixelCanvas {
  constructor(width, height) { this.width = width; this.height = height; this.rgba = Buffer.alloc(width * height * 4); }
  fillRect(x, y, width, height, fill) {
    if (![x, y, width, height].every(Number.isInteger) || x < 0 || y < 0 || x + width > this.width || y + height > this.height) throw new TypeError('Review rectangle is outside the PNG canvas.');
    const [r, g, b, a] = hexToRgba(fill);
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      const offset = ((py * this.width) + px) * 4;
      this.rgba[offset] = r; this.rgba[offset + 1] = g; this.rgba[offset + 2] = b; this.rgba[offset + 3] = a;
    }
  }
  textWidth(value, scale) { return Math.max(0, (value.length * 6 * scale) - scale); }
  drawText(value, x, y, scale, fill) {
    let cursor = x;
    for (const character of value.toUpperCase()) {
      const rows = FONT[character];
      if (!rows) throw new TypeError(`Review font is missing glyph ${character}.`);
      for (let row = 0; row < 7; row++) for (let column = 0; column < 5; column++) if (rows[row] & (1 << (4 - column))) this.fillRect(cursor + (column * scale), y + (row * scale), scale, scale, fill);
      cursor += 6 * scale;
    }
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
  { id: 'idle', label: 'IDLE', prefix: 'F', frames: 2, sequence: [0,1,0,1] },
  { id: 'walk', label: 'WALK', prefix: 'W', frames: 4, sequence: [0,1,2,3] },
  { id: 'attack', label: 'ATTACK', prefix: 'A', frames: 4, sequence: [0,1,2,3] },
  { id: 'cast', label: 'CAST', prefix: 'C', frames: 4, sequence: [0,1,2,3] },
  { id: 'hurt', label: 'HURT', prefix: 'H', frames: 2, sequence: [0,1,0,1] },
  { id: 'death', label: 'DEATH', prefix: 'D', frames: 4, sequence: [0,1,2,3] },
]);
const specs = Object.freeze({
  candidate: { kind: 'enemy', family: 'mammoth', variant: 'frostvein-wayfinder' },
  tundrahide: { kind: 'enemy', family: 'mammoth', variant: 'tundrahide-grazer' },
  cliffcoil: { kind: 'enemy', family: 'ram', variant: 'cliffcoil-strider' },
  direWolf: { kind: 'enemy', family: 'wolf', variant: 'dire' },
});
const captures = Object.fromEntries(Object.keys(specs).map((name) => [name, new Map()]));
const records = Object.fromEntries(Object.keys(specs).map((name) => [name, []]));
const key = (animation, direction, frame) => [animation, direction, frame].join('/');
const record = (captured, spec, direction, animation, frame, candidateFamily = true) => ({ family: spec.family, variant: spec.variant, ...(candidateFamily ? { candidateFamily: spec.family } : {}), direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds });

function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(576).fill(null);
  const outOfBoundsWrites = [];
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py }); else pixels[(py * 24) + px] = null; } },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py }); else pixels[(py * 24) + px] = fillStyle; } },
  };
  drawLegacySprite(context, spec, direction, animation, frame, { shadow: false });
  const occupied = pixels.flatMap((color, index) => color === null ? [] : [{ x: index % 24, y: Math.floor(index / 24) }]);
  const bounds = occupied.length ? { minX: Math.min(...occupied.map(({ x }) => x)), minY: Math.min(...occupied.map(({ y }) => y)), maxX: Math.max(...occupied.map(({ x }) => x)), maxY: Math.max(...occupied.map(({ y }) => y)) } : null;
  return Object.freeze({ pixels: Object.freeze(pixels), opaquePixels: occupied.length, bounds: bounds && Object.freeze(bounds), outOfBoundsWrites: Object.freeze(outOfBoundsWrites), digest: pixelDigest(pixels), alphaDigest: alphaDigest(pixels) });
}

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = {
    candidate: captureEnemyExpansionFrame(EN_E10_FROSTVEIN_WAYFINDER_REGISTRY, specs.candidate, direction, animation.id, frame),
    tundrahide: captureEnemyExpansionFrame(EN_E10_TUNDRAHIDE_GRAZER_REGISTRY, specs.tundrahide, direction, animation.id, frame),
    cliffcoil: captureEnemyExpansionFrame(EN_E10_CLIFFCOIL_STRIDER_REGISTRY, specs.cliffcoil, direction, animation.id, frame),
    direWolf: captureLegacyFrame(specs.direWolf, direction, animation.id, frame),
  };
  for (const name of Object.keys(captured)) {
    captures[name].set(key(animation.id, direction, frame), captured[name]);
    records[name].push(record(captured[name], specs[name], direction, animation.id, frame, name !== 'direWolf'));
  }
}

function pixelsFor(animation, direction, frame, mode) {
  const captured = captures.candidate.get(key(animation, direction, frame));
  if (mode === 'raw') return captured.pixels;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E10_FROSTVEIN_WAYFINDER_DATA);
  return mode === 'outlined' ? presentation.complete : presentation.formComplete;
}

function renderBoard({ title, subtitle, mode }) {
  const margin = 16, labelWidth = 130, scale = 3, frameSize = 72, frameGap = 6, groupWidth = 306, directionGap = 14, headerHeight = 96, rowHeight = 108;
  const width = (margin * 2) + labelWidth + (groupWidth * 4) + (directionGap * 3), height = headerHeight + (rowHeight * 6) + margin;
  const canvas = new PixelCanvas(width, height), groupX = (index) => margin + labelWidth + (index * (groupWidth + directionGap));
  canvas.fillRect(0, 0, width, height, COLORS.background); canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel); canvas.drawText(title, margin, 14, 3, COLORS.title); canvas.drawText(subtitle, margin, 50, 1, COLORS.muted);
  for (let index = 0; index < 4; index++) canvas.drawCenteredText(directions[index], groupX(index) + (groupWidth / 2), 72, 2, COLORS.candidate);
  for (let row = 0; row < animations.length; row++) {
    const animation = animations[row], top = headerHeight + (row * rowHeight);
    canvas.fillRect(margin, top + 4, width - (margin * 2), rowHeight - 8, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt); canvas.fillRect(margin, top + 4, 5, rowHeight - 8, COLORS.candidate); canvas.drawText(animation.label, margin + 18, top + 30, 2, COLORS.text); canvas.drawText(animation.frames + ' FRAMES', margin + 18, top + 62, 1, COLORS.candidate);
    for (let directionIndex = 0; directionIndex < 4; directionIndex++) {
      const actualWidth = (frameSize * animation.frames) + (frameGap * (animation.frames - 1)), startX = Math.round(groupX(directionIndex) + ((groupWidth - actualWidth) / 2));
      for (let frame = 0; frame < animation.frames; frame++) {
        const x = startX + (frame * (frameSize + frameGap)); canvas.drawPixels(pixelsFor(animation.id, directions[directionIndex], frame, mode), x, top + 13, scale); canvas.drawCenteredText(animation.prefix + (frame + 1), x + 36, top + 91, 1, COLORS.muted);
      }
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

function renderComparisonBoard() {
  const samples = [{ animation: 'idle', frame: 0, label: 'IDLE F1' }, { animation: 'walk', frame: 2, label: 'WALK W3' }, { animation: 'attack', frame: 2, label: 'ATTACK A3' }, { animation: 'hurt', frame: 1, label: 'HURT H2' }];
  const width = 1520, height = 548, headerHeight = 96, labelWidth = 120, groupWidth = 350, rowHeight = 108, canvas = new PixelCanvas(width, height);
  canvas.fillRect(0, 0, width, height, COLORS.background); canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel); canvas.drawText('EN-E10 MAMMOTH FROSTVEIN WAYFINDER', 16, 14, 3, COLORS.title); canvas.drawText('APPROVED TUNDRAHIDE AND CLIFFCOIL PLUS PUBLIC DIRE WOLF VS SPECIALIST MAMMOTH', 16, 50, 1, COLORS.muted);
  for (let index = 0; index < 4; index++) canvas.drawCenteredText(directions[index], labelWidth + (index * groupWidth) + (groupWidth / 2), 72, 2, COLORS.candidate);
  for (let row = 0; row < samples.length; row++) {
    const sample = samples[row], top = headerHeight + (row * rowHeight); canvas.fillRect(16, top + 4, width - 32, rowHeight - 8, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt); canvas.drawText(sample.label, 28, top + 30, 1, COLORS.text);
    for (let index = 0; index < 4; index++) {
      const x = labelWidth + (index * groupWidth), captureKey = key(sample.animation, directions[index], sample.frame);
      canvas.drawPixels(captures.tundrahide.get(captureKey).pixels, x + 4, top + 12, 3); canvas.drawPixels(captures.cliffcoil.get(captureKey).pixels, x + 90, top + 12, 3); canvas.drawPixels(captures.direWolf.get(captureKey).pixels, x + 176, top + 12, 3); canvas.drawPixels(captures.candidate.get(captureKey).pixels, x + 262, top + 12, 3);
      canvas.drawCenteredText('TUNDRAHIDE', x + 40, top + 90, 1, COLORS.preceding); canvas.drawCenteredText('CLIFFCOIL', x + 126, top + 90, 1, COLORS.preceding); canvas.drawCenteredText('DIRE WOLF', x + 212, top + 90, 1, COLORS.preceding); canvas.drawCenteredText('FROSTVEIN', x + 298, top + 90, 1, COLORS.candidate);
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

function renderAnimationFrame(phase, assembled) {
  const width = 640, height = 672, headerHeight = 48, labelWidth = 112, cellWidth = 128, rowHeight = 104, canvas = new PixelCanvas(width, height);
  canvas.fillRect(0, 0, width, height, COLORS.background); canvas.fillRect(0, 0, width, headerHeight, COLORS.panel); canvas.drawText('FROSTVEIN ' + (assembled ? 'COMPLETE B + FORM' : 'RAW'), 12, 6, 2, COLORS.title); canvas.drawText('PHASE ' + (phase + 1), 12, 30, 1, COLORS.candidate);
  for (let index = 0; index < 4; index++) canvas.drawCenteredText(directions[index], labelWidth + (index * cellWidth) + 64, 30, 1, COLORS.text);
  for (let row = 0; row < animations.length; row++) {
    const animation = animations[row], top = headerHeight + (row * rowHeight), frame = animation.sequence[phase]; canvas.fillRect(0, top, width, rowHeight, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt); canvas.fillRect(0, top, 5, rowHeight, COLORS.candidate); canvas.drawText(animation.label, 16, top + 38, 2, COLORS.text);
    for (let index = 0; index < 4; index++) {
      const x = labelWidth + (index * cellWidth); if (index > 0) canvas.fillRect(x, top, 1, rowHeight, COLORS.border); canvas.drawPixels(pixelsFor(animation.id, directions[index], frame, assembled ? 'assembled' : 'raw'), x + 28, top + 16, 3, false); canvas.drawCenteredText(animation.prefix + (frame + 1), x + 64, top + 88, 1, COLORS.muted);
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

const rawBoard = renderBoard({ title: 'EN-E10 MAMMOTH FROSTVEIN WAYFINDER', subtitle: 'ONE COMPLETE SPECIALIST LONG TUSK TRUNK FEINT FULL MOTION', mode: 'raw' });
const outlinedBoard = renderBoard({ title: 'EN-E10 FROSTVEIN OUTLINED COMPLETE B', subtitle: 'DISTINCT OUTLINE REVIEW EVIDENCE ONLY NO PUBLIC OUTLINE REGISTRATION', mode: 'outlined' });
const assembledBoard = renderBoard({ title: 'EN-E10 FROSTVEIN COMPLETE B + FORM', subtitle: 'SLATE BLUE WOOL LONG IVORY TUSKS FROST VEINS EFFECTS EXTERNAL', mode: 'assembled' });
const comparisonBoard = renderComparisonBoard();
const hashes = { raw: createHash('sha256').update(rawBoard.png).digest('hex'), outlined: createHash('sha256').update(outlinedBoard.png).digest('hex'), assembled: createHash('sha256').update(assembledBoard.png).digest('hex'), comparison: createHash('sha256').update(comparisonBoard.png).digest('hex') };
const digests = Object.fromEntries(Object.keys(records).map((name) => [name, createHash('sha256').update(JSON.stringify(records[name])).digest('hex')]));
const drift = [];
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.artifactSha256 && hashes.raw !== EN_E10_FROSTVEIN_WAYFINDER_GATE.artifactSha256) drift.push('raw review drift');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.outlinedArtifactSha256 && hashes.outlined !== EN_E10_FROSTVEIN_WAYFINDER_GATE.outlinedArtifactSha256) drift.push('outlined review drift');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.assembledArtifactSha256 && hashes.assembled !== EN_E10_FROSTVEIN_WAYFINDER_GATE.assembledArtifactSha256) drift.push('assembled review drift');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.comparisonArtifactSha256 && hashes.comparison !== EN_E10_FROSTVEIN_WAYFINDER_GATE.comparisonArtifactSha256) drift.push('comparison review drift');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest && digests.candidate !== EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest) drift.push('candidate digest drift');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.tundrahideComparisonDigest && digests.tundrahide !== EN_E10_FROSTVEIN_WAYFINDER_GATE.tundrahideComparisonDigest) drift.push('Tundrahide digest drift');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.cliffcoilComparisonDigest && digests.cliffcoil !== EN_E10_FROSTVEIN_WAYFINDER_GATE.cliffcoilComparisonDigest) drift.push('Cliffcoil digest drift');
if (EN_E10_FROSTVEIN_WAYFINDER_GATE.direWolfComparisonDigest && digests.direWolf !== EN_E10_FROSTVEIN_WAYFINDER_GATE.direWolfComparisonDigest) drift.push('Dire Wolf digest drift');
if (drift.length) throw new Error('EN-E10 Frostvein Wayfinder evidence drifted: ' + drift.join(', '));

const report = {
  format: 'enemy-expansion-en-e10-mammoth-frostvein-wayfinder-full-v1', sliceId: 'EN-E10', state: EN_E10_FROSTVEIN_WAYFINDER_GATE.status,
  actorTopology: EN_E10_FROSTVEIN_WAYFINDER_DATA.actorTopology, childAssets: [], candidate: specs.candidate,
  comparison: [specs.tundrahide, specs.cliffcoil, specs.direWolf], artifact: path.basename(EN_E10_FROSTVEIN_WAYFINDER_GATE.artifact),
  png: { width: rawBoard.width, height: rawBoard.height, sha256: hashes.raw }, outlinedArtifact: path.basename(EN_E10_FROSTVEIN_WAYFINDER_GATE.outlinedArtifact),
  outlinedPng: { width: outlinedBoard.width, height: outlinedBoard.height, sha256: hashes.outlined }, assembledArtifact: path.basename(EN_E10_FROSTVEIN_WAYFINDER_GATE.assembledArtifact),
  assembledPng: { width: assembledBoard.width, height: assembledBoard.height, sha256: hashes.assembled }, comparisonArtifact: path.basename(EN_E10_FROSTVEIN_WAYFINDER_GATE.comparisonArtifact),
  comparisonPng: { width: comparisonBoard.width, height: comparisonBoard.height, sha256: hashes.comparison },
  animationFrames: { raw: [1,2,3,4].map((frame) => `animation-frames/raw-${frame}.png`), completeBForm: [1,2,3,4].map((frame) => `animation-frames/complete-b-form-${frame}.png`), width: 640, height: 672, frameDurationMs: 180 },
  candidateFrameDigest: digests.candidate, comparisonDigests: { tundrahide: digests.tundrahide, cliffcoil: digests.cliffcoil, direWolf: digests.direWolf },
  authorization: EN_E10_FROSTVEIN_WAYFINDER_GATE, candidateFrames: records.candidate, comparisonFrames: { tundrahide: records.tundrahide, cliffcoil: records.cliffcoil, direWolf: records.direWolf },
  guarantees: { candidateFamilies: 1, candidateVariants: 1, candidateFrames: 80, publicCandidateFamilies: 0, animationsRendered: animations.map(({ id }) => id), directions, binaryAlpha: true, actorTopology: 'baked-single-actor-tusked-heavy-grounded-quadruped', childAssetCount: 0, publicRegistrationApplied: false, outlineRegistrationApplied: false, effectBoundary: EN_E10_FROSTVEIN_WAYFINDER_DATA.effectBoundary, effects: 'off', outlinedPresentation: ['Complete B'], assembledPresentation: ['Complete B', 'Form'] },
};

await mkdir(animationOutput, { recursive: true });
await writeFile(path.join(output, report.artifact), rawBoard.png);
await writeFile(path.join(output, report.outlinedArtifact), outlinedBoard.png);
await writeFile(path.join(output, report.assembledArtifact), assembledBoard.png);
await writeFile(path.join(output, report.comparisonArtifact), comparisonBoard.png);
for (let phase = 0; phase < 4; phase++) {
  await writeFile(path.join(animationOutput, `raw-${phase + 1}.png`), renderAnimationFrame(phase, false).png);
  await writeFile(path.join(animationOutput, `complete-b-form-${phase + 1}.png`), renderAnimationFrame(phase, true).png);
}
await writeFile(path.join(output, 'en-e10-mammoth-frostvein-wayfinder-full-review.json'), JSON.stringify(report, null, 2) + '\n');
console.log('Generated the bounded EN-E10 Mammoth Frostvein Wayfinder full-enemy evidence.');
console.log('- Raw PNG SHA-256: ' + hashes.raw);
console.log('- Outlined Complete B PNG SHA-256: ' + hashes.outlined);
console.log('- Complete B + Form PNG SHA-256: ' + hashes.assembled);
console.log('- Family comparison PNG SHA-256: ' + hashes.comparison);
console.log('- Candidate frame digest: ' + digests.candidate);
console.log('- Approved Tundrahide frame digest: ' + digests.tundrahide);
console.log('- Approved Cliffcoil frame digest: ' + digests.cliffcoil);
console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
