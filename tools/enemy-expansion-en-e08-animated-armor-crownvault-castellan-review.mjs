import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ENEMY_EXPANSION_PROFILE } from '../engine/enemy-expansion.js';
import { EN_E01_PUBLIC_REGISTRY } from '../engine/enemy-expansion-en-e01.js';
import { EN_E08_HOLLOW_SENTRY_REGISTRY } from '../engine/enemy-expansion-en-e08-animated-armor-hollow-sentry.js';
import { EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY } from '../engine/enemy-expansion-en-e08-animated-armor-runeforge-custodian.js';
import {
  EN_E08_CROWNVAULT_CASTELLAN_DATA,
  EN_E08_CROWNVAULT_CASTELLAN_GATE,
  EN_E08_CROWNVAULT_CASTELLAN_REGISTRY,
} from '../engine/enemy-expansion-en-e08-animated-armor-crownvault-castellan.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e08-animated-armor-crownvault-castellan');
const animationOutput = path.join(output, 'animation-frames');
const FONT = Object.freeze({
  ' ': [0,0,0,0,0,0,0], '+': [0,4,4,31,4,4,0], '-': [0,0,0,31,0,0,0], '/': [1,2,2,4,8,8,16],
  '0':[14,17,19,21,25,17,14], '1':[4,12,4,4,4,4,14], '2':[14,17,1,2,4,8,31], '3':[30,1,1,14,1,1,30], '4':[2,6,10,18,31,2,2], '5':[31,16,16,30,1,1,30], '6':[14,16,16,30,17,17,14], '7':[31,1,2,4,8,8,8], '8':[14,17,17,14,17,17,14], '9':[14,17,17,15,1,1,14],
  A:[14,17,17,31,17,17,17], B:[30,17,17,30,17,17,30], C:[15,16,16,16,16,16,15], D:[30,17,17,17,17,17,30], E:[31,16,16,30,16,16,31], F:[31,16,16,30,16,16,16], G:[15,16,16,19,17,17,15], H:[17,17,17,31,17,17,17], I:[31,4,4,4,4,4,31], J:[7,2,2,2,18,18,12], K:[17,18,20,24,20,18,17], L:[16,16,16,16,16,16,31], M:[17,27,21,21,17,17,17], N:[17,25,21,19,17,17,17], O:[14,17,17,17,17,17,14], P:[30,17,17,30,16,16,16], Q:[14,17,17,17,21,18,13], R:[30,17,17,30,20,18,17], S:[15,16,16,14,1,1,30], T:[31,4,4,4,4,4,4], U:[17,17,17,17,17,17,14], V:[17,17,17,17,17,10,4], W:[17,17,17,17,21,27,17], X:[17,17,10,4,10,17,17], Y:[17,17,10,4,4,4,4], Z:[31,1,2,4,8,16,31],
});
const COLORS = Object.freeze({
  background: '#0b0f16', panel: '#141a24', panelAlt: '#111721', border: '#344052',
  title: '#d8bd72', candidate: '#79c7b2', preceding: '#a9b86f', text: '#edf5ff',
  muted: '#9aa8b8', checkerA: '#202a37', checkerB: '#293646',
});

class PixelCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.rgba = Buffer.alloc(width * height * 4);
  }

  fillRect(x, y, width, height, fill) {
    if (![x, y, width, height].every(Number.isInteger) || x < 0 || y < 0 || x + width > this.width || y + height > this.height) {
      throw new TypeError('Review rectangle is outside the PNG canvas.');
    }
    const [r, g, b, a] = hexToRgba(fill);
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      const offset = ((py * this.width) + px) * 4;
      this.rgba[offset] = r;
      this.rgba[offset + 1] = g;
      this.rgba[offset + 2] = b;
      this.rgba[offset + 3] = a;
    }
  }

  textWidth(value, scale) {
    return Math.max(0, (value.length * 6 * scale) - scale);
  }

  drawText(value, x, y, scale, fill) {
    let cursor = x;
    for (const character of value.toUpperCase()) {
      const rows = FONT[character];
      if (!rows) throw new TypeError(`Review font is missing glyph ${character}.`);
      for (let row = 0; row < 7; row++) for (let column = 0; column < 5; column++) {
        if (rows[row] & (1 << (4 - column))) this.fillRect(cursor + (column * scale), y + (row * scale), scale, scale, fill);
      }
      cursor += 6 * scale;
    }
  }

  drawCenteredText(value, centerX, y, scale, fill) {
    this.drawText(value, Math.round(centerX - (this.textWidth(value, scale) / 2)), y, scale, fill);
  }

  drawPixels(pixels, x, y, scale, border = true) {
    const size = ENEMY_EXPANSION_PROFILE.frameContract.cell;
    if (border) this.fillRect(x - 2, y - 2, (size * scale) + 4, (size * scale) + 4, COLORS.border);
    for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
      this.fillRect(
        x + (px * scale),
        y + (py * scale),
        scale,
        scale,
        pixels[(py * size) + px] || ((px + py) % 2 === 0 ? COLORS.checkerA : COLORS.checkerB),
      );
    }
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
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'animated-armor', variant: 'crownvault-castellan' });
const fallenKnightSpec = Object.freeze({ kind: 'enemy', family: 'fallen-knight', variant: 'shieldbearer' });
const runeforgeCustodianSpec = Object.freeze({ kind: 'enemy', family: 'animated-armor', variant: 'runeforge-custodian' });
const hollowSentrySpec = Object.freeze({ kind: 'enemy', family: 'animated-armor', variant: 'hollow-sentry' });
const captures = new Map();
const fallenKnightCaptures = new Map();
const runeforgeCustodianCaptures = new Map();
const hollowSentryCaptures = new Map();
const candidateFrames = [];
const fallenKnightFrames = [];
const runeforgeCustodianFrames = [];
const hollowSentryFrames = [];
const key = (animation, direction, frame) => [animation, direction, frame].join('/');
const record = (captured, spec, direction, animation, frame) => ({
  family: spec.family,
  variant: spec.variant,
  candidateFamily: spec.family,
  direction,
  animation,
  frame,
  digest: captured.digest,
  alphaDigest: captured.alphaDigest,
  opaquePixels: captured.opaquePixels,
  bounds: captured.bounds,
});

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const candidate = captureEnemyExpansionFrame(EN_E08_CROWNVAULT_CASTELLAN_REGISTRY, candidateSpec, direction, animation.id, frame);
  const fallenKnight = captureEnemyExpansionFrame(EN_E01_PUBLIC_REGISTRY, fallenKnightSpec, direction, animation.id, frame);
  const runeforgeCustodian = captureEnemyExpansionFrame(EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY, runeforgeCustodianSpec, direction, animation.id, frame);
  const hollowSentry = captureEnemyExpansionFrame(EN_E08_HOLLOW_SENTRY_REGISTRY, hollowSentrySpec, direction, animation.id, frame);
  const frameKey = key(animation.id, direction, frame);
  captures.set(frameKey, candidate);
  fallenKnightCaptures.set(frameKey, fallenKnight);
  runeforgeCustodianCaptures.set(frameKey, runeforgeCustodian);
  hollowSentryCaptures.set(frameKey, hollowSentry);
  candidateFrames.push(record(candidate, candidateSpec, direction, animation.id, frame));
  fallenKnightFrames.push(record(fallenKnight, fallenKnightSpec, direction, animation.id, frame));
  runeforgeCustodianFrames.push(record(runeforgeCustodian, runeforgeCustodianSpec, direction, animation.id, frame));
  hollowSentryFrames.push(record(hollowSentry, hollowSentrySpec, direction, animation.id, frame));
}

function pixelsFor(animation, direction, frame, assembled) {
  const captured = captures.get(key(animation, direction, frame));
  return assembled
    ? buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E08_CROWNVAULT_CASTELLAN_DATA).formComplete
    : captured.pixels;
}

function renderBoard({ title, subtitle, assembled }) {
  const margin = 16;
  const labelWidth = 130;
  const scale = 3;
  const frameSize = 72;
  const frameGap = 6;
  const groupWidth = 306;
  const directionGap = 14;
  const headerHeight = 96;
  const rowHeight = 108;
  const width = (margin * 2) + labelWidth + (groupWidth * 4) + (directionGap * 3);
  const height = headerHeight + (rowHeight * 6) + margin;
  const canvas = new PixelCanvas(width, height);
  const groupX = (index) => margin + labelWidth + (index * (groupWidth + directionGap));
  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel);
  canvas.drawText(title, margin, 14, 3, COLORS.title);
  canvas.drawText(subtitle, margin, 50, 1, COLORS.muted);
  for (let index = 0; index < 4; index++) canvas.drawCenteredText(directions[index], groupX(index) + (groupWidth / 2), 72, 2, COLORS.candidate);
  for (let row = 0; row < animations.length; row++) {
    const animation = animations[row];
    const top = headerHeight + (row * rowHeight);
    canvas.fillRect(margin, top + 4, width - (margin * 2), rowHeight - 8, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.fillRect(margin, top + 4, 5, rowHeight - 8, COLORS.candidate);
    canvas.drawText(animation.label, margin + 18, top + 30, 2, COLORS.text);
    canvas.drawText(animation.frames + ' FRAMES', margin + 18, top + 62, 1, COLORS.candidate);
    for (let directionIndex = 0; directionIndex < 4; directionIndex++) {
      const actualWidth = (frameSize * animation.frames) + (frameGap * (animation.frames - 1));
      const startX = Math.round(groupX(directionIndex) + ((groupWidth - actualWidth) / 2));
      for (let frame = 0; frame < animation.frames; frame++) {
        const x = startX + (frame * (frameSize + frameGap));
        canvas.drawPixels(pixelsFor(animation.id, directions[directionIndex], frame, assembled), x, top + 13, scale);
        canvas.drawCenteredText(animation.prefix + (frame + 1), x + 36, top + 91, 1, COLORS.muted);
      }
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

function renderComparisonBoard() {
  const samples = [
    { animation: 'idle', frame: 0, label: 'IDLE F1' },
    { animation: 'walk', frame: 2, label: 'WALK W3' },
    { animation: 'attack', frame: 2, label: 'ATTACK A3' },
    { animation: 'hurt', frame: 1, label: 'HURT H2' },
  ];
  const width = 1520;
  const height = 548;
  const headerHeight = 96;
  const labelWidth = 120;
  const groupWidth = 350;
  const rowHeight = 108;
  const canvas = new PixelCanvas(width, height);
  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel);
  canvas.drawText('EN-E08 ANIMATED ARMOR CROWNVAULT CASTELLAN', 16, 14, 3, COLORS.title);
  canvas.drawText('RUNEFORGE HOLLOW SENTRY FALLEN KNIGHT VS FORTRESS SUIT', 16, 50, 1, COLORS.muted);
  for (let index = 0; index < 4; index++) canvas.drawCenteredText(directions[index], labelWidth + (index * groupWidth) + (groupWidth / 2), 72, 2, COLORS.candidate);
  for (let row = 0; row < samples.length; row++) {
    const sample = samples[row];
    const top = headerHeight + (row * rowHeight);
    canvas.fillRect(16, top + 4, width - 32, rowHeight - 8, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.drawText(sample.label, 28, top + 30, 1, COLORS.text);
    for (let index = 0; index < 4; index++) {
      const x = labelWidth + (index * groupWidth);
      const frameKey = key(sample.animation, directions[index], sample.frame);
      canvas.drawPixels(runeforgeCustodianCaptures.get(frameKey).pixels, x + 4, top + 12, 3);
      canvas.drawPixels(hollowSentryCaptures.get(frameKey).pixels, x + 90, top + 12, 3);
      canvas.drawPixels(fallenKnightCaptures.get(frameKey).pixels, x + 176, top + 12, 3);
      canvas.drawPixels(captures.get(frameKey).pixels, x + 262, top + 12, 3);
      canvas.drawCenteredText('RUNEFORGE', x + 40, top + 90, 1, COLORS.preceding);
      canvas.drawCenteredText('HOLLOW', x + 126, top + 90, 1, COLORS.preceding);
      canvas.drawCenteredText('FALLEN', x + 212, top + 90, 1, COLORS.preceding);
      canvas.drawCenteredText('CROWNVAULT', x + 298, top + 90, 1, COLORS.candidate);
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

function renderAnimationFrame(phase, assembled) {
  const width = 640;
  const height = 672;
  const headerHeight = 48;
  const labelWidth = 112;
  const cellWidth = 128;
  const rowHeight = 104;
  const canvas = new PixelCanvas(width, height);
  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight, COLORS.panel);
  canvas.drawText('CROWNVAULT CASTELLAN ' + (assembled ? 'COMPLETE B + FORM' : 'RAW'), 12, 6, 2, COLORS.title);
  canvas.drawText('PHASE ' + (phase + 1), 12, 30, 1, COLORS.candidate);
  for (let index = 0; index < 4; index++) canvas.drawCenteredText(directions[index], labelWidth + (index * cellWidth) + 64, 30, 1, COLORS.text);
  for (let row = 0; row < animations.length; row++) {
    const animation = animations[row];
    const top = headerHeight + (row * rowHeight);
    const frame = animation.sequence[phase];
    canvas.fillRect(0, top, width, rowHeight, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.fillRect(0, top, 5, rowHeight, COLORS.candidate);
    canvas.drawText(animation.label, 16, top + 38, 2, COLORS.text);
    for (let index = 0; index < 4; index++) {
      const x = labelWidth + (index * cellWidth);
      if (index > 0) canvas.fillRect(x, top, 1, rowHeight, COLORS.border);
      canvas.drawPixels(pixelsFor(animation.id, directions[index], frame, assembled), x + 28, top + 16, 3, false);
      canvas.drawCenteredText(animation.prefix + (frame + 1), x + 64, top + 88, 1, COLORS.muted);
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

const rawBoard = renderBoard({
  title: 'EN-E08 ANIMATED ARMOR CROWNVAULT CASTELLAN',
  subtitle: 'ROYAL FORTRESS ELITE ONE BAKED ACTOR ALL 80 FRAMES',
  assembled: false,
});
const assembledBoard = renderBoard({
  title: 'EN-E08 CROWNVAULT CASTELLAN COMPLETE B + FORM',
  subtitle: 'CROWNVAULT T SEAL GATEHOUSE BASTIONS CHILD ASSETS OFF',
  assembled: true,
});
const comparisonBoard = renderComparisonBoard();
const rawHash = createHash('sha256').update(rawBoard.png).digest('hex');
const assembledHash = createHash('sha256').update(assembledBoard.png).digest('hex');
const comparisonHash = createHash('sha256').update(comparisonBoard.png).digest('hex');
const candidateFrameDigest = createHash('sha256').update(JSON.stringify(candidateFrames)).digest('hex');
const fallenKnightFrameDigest = createHash('sha256').update(JSON.stringify(fallenKnightFrames)).digest('hex');
const runeforgeCustodianFrameDigest = createHash('sha256').update(JSON.stringify(runeforgeCustodianFrames)).digest('hex');
const hollowSentryFrameDigest = createHash('sha256').update(JSON.stringify(hollowSentryFrames)).digest('hex');
const drift = [];
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.artifactSha256 && rawHash !== EN_E08_CROWNVAULT_CASTELLAN_GATE.artifactSha256) drift.push('raw review drift');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.assembledArtifactSha256 && assembledHash !== EN_E08_CROWNVAULT_CASTELLAN_GATE.assembledArtifactSha256) drift.push('assembled review drift');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.comparisonArtifactSha256 && comparisonHash !== EN_E08_CROWNVAULT_CASTELLAN_GATE.comparisonArtifactSha256) drift.push('comparison review drift');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest && candidateFrameDigest !== EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest) drift.push('candidate digest drift');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.fallenKnightComparisonDigest && fallenKnightFrameDigest !== EN_E08_CROWNVAULT_CASTELLAN_GATE.fallenKnightComparisonDigest) drift.push('Fallen Knight digest drift');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.runeforgeCustodianComparisonDigest && runeforgeCustodianFrameDigest !== EN_E08_CROWNVAULT_CASTELLAN_GATE.runeforgeCustodianComparisonDigest) drift.push('Runeforge Custodian digest drift');
if (EN_E08_CROWNVAULT_CASTELLAN_GATE.hollowSentryComparisonDigest && hollowSentryFrameDigest !== EN_E08_CROWNVAULT_CASTELLAN_GATE.hollowSentryComparisonDigest) drift.push('Hollow Sentry digest drift');
if (drift.length) throw new Error('EN-E08 Crownvault Castellan evidence drifted: ' + drift.join(', '));

const report = {
  format: 'enemy-expansion-en-e08-animated-armor-crownvault-castellan-full-v1',
  sliceId: 'EN-E08',
  state: EN_E08_CROWNVAULT_CASTELLAN_GATE.status,
  actorTopology: EN_E08_CROWNVAULT_CASTELLAN_DATA.actorTopology,
  childAssets: EN_E08_CROWNVAULT_CASTELLAN_DATA.childAssets,
  candidate: candidateSpec,
  comparison: [runeforgeCustodianSpec, hollowSentrySpec, fallenKnightSpec],
  artifact: path.basename(EN_E08_CROWNVAULT_CASTELLAN_GATE.artifact),
  png: { width: rawBoard.width, height: rawBoard.height, sha256: rawHash },
  assembledArtifact: path.basename(EN_E08_CROWNVAULT_CASTELLAN_GATE.assembledArtifact),
  assembledPng: { width: assembledBoard.width, height: assembledBoard.height, sha256: assembledHash },
  comparisonArtifact: path.basename(EN_E08_CROWNVAULT_CASTELLAN_GATE.comparisonArtifact),
  comparisonPng: { width: comparisonBoard.width, height: comparisonBoard.height, sha256: comparisonHash },
  animationFrames: {
    raw: [1, 2, 3, 4].map((frame) => `animation-frames/raw-${frame}.png`),
    completeBForm: [1, 2, 3, 4].map((frame) => `animation-frames/complete-b-form-${frame}.png`),
    width: 640,
    height: 672,
    frameDurationMs: 180,
  },
  candidateFrameDigest,
  fallenKnightFrameDigest,
  runeforgeCustodianFrameDigest,
  hollowSentryFrameDigest,
  authorization: EN_E08_CROWNVAULT_CASTELLAN_GATE,
  candidateFrames,
  fallenKnightFrames,
  runeforgeCustodianFrames,
  hollowSentryFrames,
  guarantees: {
    candidateFamilies: 1,
    candidateVariants: 1,
    candidateFrames: 80,
    publicCandidateFamilies: 0,
    animationsRendered: animations.map(({ id }) => id),
    directions,
    binaryAlpha: true,
    actorTopology: 'baked-single-actor',
    childAssetCount: 0,
    publicRegistrationApplied: false,
    effectBoundary: EN_E08_CROWNVAULT_CASTELLAN_DATA.effectBoundary,
    effects: 'off',
    assembledPresentation: ['Complete B', 'Form'],
  },
};

await mkdir(animationOutput, { recursive: true });
await writeFile(path.join(output, report.artifact), rawBoard.png);
await writeFile(path.join(output, report.assembledArtifact), assembledBoard.png);
await writeFile(path.join(output, report.comparisonArtifact), comparisonBoard.png);
for (let phase = 0; phase < 4; phase++) {
  await writeFile(path.join(animationOutput, `raw-${phase + 1}.png`), renderAnimationFrame(phase, false).png);
  await writeFile(path.join(animationOutput, `complete-b-form-${phase + 1}.png`), renderAnimationFrame(phase, true).png);
}
await writeFile(path.join(output, 'en-e08-animated-armor-crownvault-castellan-full-review.json'), JSON.stringify(report, null, 2) + String.fromCharCode(10));
console.log('Generated the bounded EN-E08 Animated Armor Crownvault Castellan full-enemy evidence.');
console.log(`- Raw PNG SHA-256: ${rawHash}`);
console.log(`- Complete B + Form PNG SHA-256: ${assembledHash}`);
console.log(`- Family comparison PNG SHA-256: ${comparisonHash}`);
console.log(`- Candidate frame digest: ${candidateFrameDigest}`);
console.log(`- Fallen Knight Shieldbearer frame digest: ${fallenKnightFrameDigest}`);
console.log(`- Runeforge Custodian frame digest: ${runeforgeCustodianFrameDigest}`);
console.log(`- Hollow Sentry frame digest: ${hollowSentryFrameDigest}`);
