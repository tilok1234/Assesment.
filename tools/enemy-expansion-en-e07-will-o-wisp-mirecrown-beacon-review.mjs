import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { ENEMY_EXPANSION_PROFILE } from '../engine/enemy-expansion.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { EN_E07_LANTERN_MOTE_REGISTRY } from '../engine/enemy-expansion-en-e07-will-o-wisp-lantern-mote.js';
import { EN_E07_FENBELL_SHEPHERD_REGISTRY } from '../engine/enemy-expansion-en-e07-will-o-wisp-fenbell-shepherd.js';
import {
  EN_E07_MIRECROWN_BEACON_DATA,
  EN_E07_MIRECROWN_BEACON_GATE,
  EN_E07_MIRECROWN_BEACON_REGISTRY,
} from '../engine/enemy-expansion-en-e07-will-o-wisp-mirecrown-beacon.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
  pixelDigest,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e07-will-o-wisp-mirecrown-beacon');
const animationOutput = path.join(output, 'animation-frames');
const FONT = Object.freeze({
  ' ': [0,0,0,0,0,0,0], '+': [0,4,4,31,4,4,0], '-': [0,0,0,31,0,0,0], '/': [1,2,2,4,8,8,16],
  '0':[14,17,19,21,25,17,14], '1':[4,12,4,4,4,4,14], '2':[14,17,1,2,4,8,31], '3':[30,1,1,14,1,1,30], '4':[2,6,10,18,31,2,2], '5':[31,16,16,30,1,1,30], '6':[14,16,16,30,17,17,14], '7':[31,1,2,4,8,8,8], '8':[14,17,17,14,17,17,14], '9':[14,17,17,15,1,1,14],
  A:[14,17,17,31,17,17,17], B:[30,17,17,30,17,17,30], C:[15,16,16,16,16,16,15], D:[30,17,17,17,17,17,30], E:[31,16,16,30,16,16,31], F:[31,16,16,30,16,16,16], G:[15,16,16,19,17,17,15], H:[17,17,17,31,17,17,17], I:[31,4,4,4,4,4,31], J:[7,2,2,2,18,18,12], K:[17,18,20,24,20,18,17], L:[16,16,16,16,16,16,31], M:[17,27,21,21,17,17,17], N:[17,25,21,19,17,17,17], O:[14,17,17,17,17,17,14], P:[30,17,17,30,16,16,16], Q:[14,17,17,17,21,18,13], R:[30,17,17,30,20,18,17], S:[15,16,16,14,1,1,30], T:[31,4,4,4,4,4,4], U:[17,17,17,17,17,17,14], V:[17,17,17,17,17,10,4], W:[17,17,17,17,21,27,17], X:[17,17,10,4,10,17,17], Y:[17,17,10,4,4,4,4], Z:[31,1,2,4,8,16,31],
});
const COLORS = Object.freeze({
  background: '#0b0f16', panel: '#141a24', panelAlt: '#111721', border: '#344052',
  title: '#e8ad63', candidate: '#74d2ca', comparison: '#a9b86f', text: '#edf5ff',
  muted: '#9aa8b8', checkerA: '#202a37', checkerB: '#293646',
});

class PixelCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.rgba = Buffer.alloc(width * height * 4);
  }

  fillRect(x, y, width, height, fill) {
    if (![x, y, width, height].every(Number.isInteger)
      || x < 0 || y < 0 || x + width > this.width || y + height > this.height) {
      throw new TypeError(`Review rectangle ${x},${y} ${width}x${height} is outside ${this.width}x${this.height}.`);
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

  textWidth(value, scale) { return Math.max(0, (value.length * 6 * scale) - scale); }

  drawText(value, x, y, scale, fill) {
    let cursor = x;
    for (const character of value.toUpperCase()) {
      const rows = FONT[character];
      if (!rows) throw new TypeError(`Review font is missing glyph ${character}.`);
      for (let row = 0; row < 7; row++) for (let column = 0; column < 5; column++) {
        if (rows[row] & (1 << (4 - column))) {
          this.fillRect(cursor + (column * scale), y + (row * scale), scale, scale, fill);
        }
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
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'will-o-wisp', variant: 'mirecrown-beacon' });
const fenbellShepherdSpec = Object.freeze({ kind: 'enemy', family: 'will-o-wisp', variant: 'fenbell-shepherd' });
const lanternMoteSpec = Object.freeze({ kind: 'enemy', family: 'will-o-wisp', variant: 'lantern-mote' });
const spectralGhostSpec = Object.freeze({ kind: 'enemy', family: 'ghost', variant: 'spectral' });
const flameElementalSpec = Object.freeze({ kind: 'enemy', family: 'elemental', variant: 'flame' });
const captures = new Map();
const fenbellShepherdCaptures = new Map();
const lanternMoteCaptures = new Map();
const spectralGhostCaptures = new Map();
const flameElementalCaptures = new Map();
const candidateFrames = [];
const fenbellShepherdFrames = [];
const lanternMoteFrames = [];
const spectralGhostFrames = [];
const flameElementalFrames = [];
const key = (animation, direction, frame) => [animation, direction, frame].join('/');
const record = (captured, spec, direction, animation, frame, candidateFamily = true) => ({
  family: spec.family,
  variant: spec.variant,
  ...(candidateFamily ? { candidateFamily: spec.family } : {}),
  direction,
  animation,
  frame,
  digest: captured.digest,
  alphaDigest: captured.alphaDigest,
  opaquePixels: captured.opaquePixels,
  bounds: captured.bounds,
});

function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(576).fill(null);
  const outOfBoundsWrites = [];
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py });
        else pixels[(py * 24) + px] = null;
      }
    },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py });
        else pixels[(py * 24) + px] = fillStyle;
      }
    },
  };
  drawLegacySprite(context, spec, direction, animation, frame, { shadow: false });
  const occupied = pixels.flatMap((color, index) => (
    color === null ? [] : [{ x: index % 24, y: Math.floor(index / 24) }]
  ));
  const bounds = occupied.length ? {
    minX: Math.min(...occupied.map(({ x }) => x)),
    minY: Math.min(...occupied.map(({ y }) => y)),
    maxX: Math.max(...occupied.map(({ x }) => x)),
    maxY: Math.max(...occupied.map(({ y }) => y)),
  } : null;
  return Object.freeze({
    pixels: Object.freeze(pixels),
    opaquePixels: occupied.length,
    bounds: bounds && Object.freeze(bounds),
    outOfBoundsWrites: Object.freeze(outOfBoundsWrites),
    digest: pixelDigest(pixels),
    alphaDigest: alphaDigest(pixels),
  });
}

for (const animation of animations) for (const direction of directions) {
  for (let frame = 0; frame < animation.frames; frame++) {
    const candidate = captureEnemyExpansionFrame(EN_E07_MIRECROWN_BEACON_REGISTRY, candidateSpec, direction, animation.id, frame);
    const fenbellShepherd = captureEnemyExpansionFrame(EN_E07_FENBELL_SHEPHERD_REGISTRY, fenbellShepherdSpec, direction, animation.id, frame);
    const lanternMote = captureEnemyExpansionFrame(EN_E07_LANTERN_MOTE_REGISTRY, lanternMoteSpec, direction, animation.id, frame);
    const spectralGhost = captureLegacyFrame(spectralGhostSpec, direction, animation.id, frame);
    const flameElemental = captureLegacyFrame(flameElementalSpec, direction, animation.id, frame);
    const frameKey = key(animation.id, direction, frame);
    captures.set(frameKey, candidate);
    fenbellShepherdCaptures.set(frameKey, fenbellShepherd);
    lanternMoteCaptures.set(frameKey, lanternMote);
    spectralGhostCaptures.set(frameKey, spectralGhost);
    flameElementalCaptures.set(frameKey, flameElemental);
    candidateFrames.push(record(candidate, candidateSpec, direction, animation.id, frame));
    fenbellShepherdFrames.push(record(fenbellShepherd, fenbellShepherdSpec, direction, animation.id, frame));
    lanternMoteFrames.push(record(lanternMote, lanternMoteSpec, direction, animation.id, frame));
    spectralGhostFrames.push(record(spectralGhost, spectralGhostSpec, direction, animation.id, frame, false));
    flameElementalFrames.push(record(flameElemental, flameElementalSpec, direction, animation.id, frame, false));
  }
}

function pixelsFor(animation, direction, frame, assembled) {
  const captured = captures.get(key(animation, direction, frame));
  return assembled
    ? buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E07_MIRECROWN_BEACON_DATA).formComplete
    : captured.pixels;
}

function renderBoard({ title, subtitle, assembled }) {
  const margin = 16, labelWidth = 130, scale = 3, frameSize = 72, frameGap = 6;
  const groupWidth = 306, directionGap = 14, headerHeight = 96, rowHeight = 108;
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
    canvas.drawText(`${animation.frames} FRAMES`, margin + 18, top + 62, 1, COLORS.candidate);
    for (let directionIndex = 0; directionIndex < 4; directionIndex++) {
      const actualWidth = (frameSize * animation.frames) + (frameGap * (animation.frames - 1));
      const startX = Math.round(groupX(directionIndex) + ((groupWidth - actualWidth) / 2));
      for (let frame = 0; frame < animation.frames; frame++) {
        const x = startX + (frame * (frameSize + frameGap));
        canvas.drawPixels(pixelsFor(animation.id, directions[directionIndex], frame, assembled), x, top + 13, scale);
        canvas.drawCenteredText(`${animation.prefix}${frame + 1}`, x + 36, top + 91, 1, COLORS.muted);
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
  const width = 1864, height = 548, headerHeight = 96, labelWidth = 120, groupWidth = 436, rowHeight = 108;
  const canvas = new PixelCanvas(width, height);
  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel);
  canvas.drawText('EN-E07 WILL-O-WISP MIRECROWN BEACON', 16, 14, 3, COLORS.title);
  canvas.drawText('APPROVED MOTE FENBELL PUBLIC GHOST FLAME VS ELITE', 16, 50, 1, COLORS.muted);
  for (let index = 0; index < 4; index++) canvas.drawCenteredText(directions[index], labelWidth + (index * groupWidth) + (groupWidth / 2), 72, 2, COLORS.candidate);
  for (let row = 0; row < samples.length; row++) {
    const sample = samples[row];
    const top = headerHeight + (row * rowHeight);
    canvas.fillRect(16, top + 4, width - 32, rowHeight - 8, row % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.drawText(sample.label, 28, top + 30, 1, COLORS.text);
    for (let directionIndex = 0; directionIndex < 4; directionIndex++) {
      const x = labelWidth + (directionIndex * groupWidth);
      const frameKey = key(sample.animation, directions[directionIndex], sample.frame);
      canvas.drawPixels(lanternMoteCaptures.get(frameKey).pixels, x + 4, top + 12, 3);
      canvas.drawPixels(fenbellShepherdCaptures.get(frameKey).pixels, x + 90, top + 12, 3);
      canvas.drawPixels(spectralGhostCaptures.get(frameKey).pixels, x + 176, top + 12, 3);
      canvas.drawPixels(flameElementalCaptures.get(frameKey).pixels, x + 262, top + 12, 3);
      canvas.drawPixels(captures.get(frameKey).pixels, x + 348, top + 12, 3);
      canvas.drawCenteredText('MOTE', x + 40, top + 90, 1, COLORS.comparison);
      canvas.drawCenteredText('FENBELL', x + 126, top + 90, 1, COLORS.comparison);
      canvas.drawCenteredText('GHOST', x + 212, top + 90, 1, COLORS.comparison);
      canvas.drawCenteredText('FLAME', x + 298, top + 90, 1, COLORS.title);
      canvas.drawCenteredText('MIRECROWN', x + 384, top + 90, 1, COLORS.candidate);
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

function renderAnimationFrame(phase, assembled) {
  const width = 640, height = 672, headerHeight = 48, labelWidth = 112, cellWidth = 128, rowHeight = 104;
  const canvas = new PixelCanvas(width, height);
  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight, COLORS.panel);
  canvas.drawText(`MIRECROWN ${assembled ? 'COMPLETE B + FORM' : 'RAW'}`, 12, 6, 2, COLORS.title);
  canvas.drawText(`PHASE ${phase + 1}`, 12, 30, 1, COLORS.candidate);
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
      canvas.drawCenteredText(`${animation.prefix}${frame + 1}`, x + 64, top + 88, 1, COLORS.muted);
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

const rawBoard = renderBoard({
  title: 'EN-E07 WILL-O-WISP MIRECROWN BEACON',
  subtitle: 'ONE PRIVATE ELITE DEFAULT IDLE WALK ATTACK CAST HURT DEATH',
  assembled: false,
});
const assembledBoard = renderBoard({
  title: 'EN-E07 MIRECROWN COMPLETE B + FORM',
  subtitle: 'CROWN WICK DOUBLE CAGE SINGLE EYE FOUR TINES EFFECTS EXTERNAL',
  assembled: true,
});
const comparisonBoard = renderComparisonBoard();
const rawHash = createHash('sha256').update(rawBoard.png).digest('hex');
const assembledHash = createHash('sha256').update(assembledBoard.png).digest('hex');
const comparisonHash = createHash('sha256').update(comparisonBoard.png).digest('hex');
const candidateFrameDigest = createHash('sha256').update(JSON.stringify(candidateFrames)).digest('hex');
const fenbellShepherdFrameDigest = createHash('sha256').update(JSON.stringify(fenbellShepherdFrames)).digest('hex');
const lanternMoteFrameDigest = createHash('sha256').update(JSON.stringify(lanternMoteFrames)).digest('hex');
const spectralGhostFrameDigest = createHash('sha256').update(JSON.stringify(spectralGhostFrames)).digest('hex');
const flameElementalFrameDigest = createHash('sha256').update(JSON.stringify(flameElementalFrames)).digest('hex');
const drift = [];
if (EN_E07_MIRECROWN_BEACON_GATE.artifactSha256 && rawHash !== EN_E07_MIRECROWN_BEACON_GATE.artifactSha256) drift.push('raw review drift');
if (EN_E07_MIRECROWN_BEACON_GATE.assembledArtifactSha256 && assembledHash !== EN_E07_MIRECROWN_BEACON_GATE.assembledArtifactSha256) drift.push('assembled review drift');
if (EN_E07_MIRECROWN_BEACON_GATE.comparisonArtifactSha256 && comparisonHash !== EN_E07_MIRECROWN_BEACON_GATE.comparisonArtifactSha256) drift.push('comparison review drift');
if (EN_E07_MIRECROWN_BEACON_GATE.candidateFrameDigest && candidateFrameDigest !== EN_E07_MIRECROWN_BEACON_GATE.candidateFrameDigest) drift.push('candidate digest drift');
if (fenbellShepherdFrameDigest !== EN_E07_MIRECROWN_BEACON_GATE.fenbellShepherdComparisonDigest) drift.push('Fenbell Shepherd digest drift');
if (lanternMoteFrameDigest !== EN_E07_MIRECROWN_BEACON_GATE.lanternMoteComparisonDigest) drift.push('Lantern Mote digest drift');
if (EN_E07_MIRECROWN_BEACON_GATE.spectralGhostComparisonDigest && spectralGhostFrameDigest !== EN_E07_MIRECROWN_BEACON_GATE.spectralGhostComparisonDigest) drift.push('Spectral Ghost digest drift');
if (EN_E07_MIRECROWN_BEACON_GATE.flameElementalComparisonDigest && flameElementalFrameDigest !== EN_E07_MIRECROWN_BEACON_GATE.flameElementalComparisonDigest) drift.push('Flame Elemental digest drift');
if (drift.length) throw new Error(`EN-E07 Mirecrown Beacon evidence drifted: ${drift.join(', ')}`);

const report = {
  format: 'enemy-expansion-en-e07-will-o-wisp-mirecrown-beacon-full-v1',
  sliceId: 'EN-E07',
  state: EN_E07_MIRECROWN_BEACON_GATE.status,
  candidate: candidateSpec,
  comparison: [lanternMoteSpec, fenbellShepherdSpec, spectralGhostSpec, flameElementalSpec],
  artifact: path.basename(EN_E07_MIRECROWN_BEACON_GATE.artifact),
  png: { width: rawBoard.width, height: rawBoard.height, sha256: rawHash },
  assembledArtifact: path.basename(EN_E07_MIRECROWN_BEACON_GATE.assembledArtifact),
  assembledPng: { width: assembledBoard.width, height: assembledBoard.height, sha256: assembledHash },
  comparisonArtifact: path.basename(EN_E07_MIRECROWN_BEACON_GATE.comparisonArtifact),
  comparisonPng: { width: comparisonBoard.width, height: comparisonBoard.height, sha256: comparisonHash },
  animationFrames: {
    raw: [1, 2, 3, 4].map((frame) => `animation-frames/raw-${frame}.png`),
    completeBForm: [1, 2, 3, 4].map((frame) => `animation-frames/complete-b-form-${frame}.png`),
    width: 640,
    height: 672,
    frameDurationMs: 180,
  },
  candidateFrameDigest,
  fenbellShepherdFrameDigest,
  lanternMoteFrameDigest,
  spectralGhostFrameDigest,
  flameElementalFrameDigest,
  authorization: EN_E07_MIRECROWN_BEACON_GATE,
  candidateFrames,
  fenbellShepherdFrames,
  lanternMoteFrames,
  spectralGhostFrames,
  flameElementalFrames,
  guarantees: {
    candidateFamilies: 1,
    candidateVariants: 1,
    candidateFrames: 80,
    publicCandidateFamilies: 0,
    animationsRendered: animations.map(({ id }) => id),
    directions,
    binaryAlpha: true,
    publicRegistrationApplied: false,
    effectBoundary: EN_E07_MIRECROWN_BEACON_DATA.effectBoundary,
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
await writeFile(
  path.join(output, 'en-e07-will-o-wisp-mirecrown-beacon-full-review.json'),
  `${JSON.stringify(report, null, 2)}${String.fromCharCode(10)}`,
);

console.log('Generated the bounded EN-E07 Will-o-Wisp Mirecrown Beacon full-enemy evidence.');
console.log(`- Raw PNG SHA-256: ${rawHash}`);
console.log(`- Complete B + Form PNG SHA-256: ${assembledHash}`);
console.log(`- Family comparison PNG SHA-256: ${comparisonHash}`);
console.log(`- Candidate frame digest: ${candidateFrameDigest}`);
console.log(`- Approved Fenbell Shepherd frame digest: ${fenbellShepherdFrameDigest}`);
console.log(`- Approved Lantern Mote frame digest: ${lanternMoteFrameDigest}`);
console.log(`- Public Spectral Ghost frame digest: ${spectralGhostFrameDigest}`);
console.log(`- Public Flame Elemental frame digest: ${flameElementalFrameDigest}`);
