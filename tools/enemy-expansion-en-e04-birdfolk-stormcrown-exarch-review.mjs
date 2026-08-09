import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ENEMY_EXPANSION_PROFILE } from '../engine/enemy-expansion.js';
import {
  EN_E04_BIRDFOLK_STORMCROWN_EXARCH_DATA,
  EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE,
  EN_E04_BIRDFOLK_STORMCROWN_EXARCH_REGISTRY,
} from '../engine/enemy-expansion-en-e04-birdfolk-stormcrown-exarch.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e04-birdfolk-stormcrown-exarch');
const animationOutput = path.join(output, 'animation-frames');

const FONT = Object.freeze({
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '+': [0, 4, 4, 31, 4, 4, 0],
  '-': [0, 0, 0, 31, 0, 0, 0],
  '/': [1, 2, 2, 4, 8, 8, 16],
  '0': [14, 17, 19, 21, 25, 17, 14],
  '1': [4, 12, 4, 4, 4, 4, 14],
  '2': [14, 17, 1, 2, 4, 8, 31],
  '3': [30, 1, 1, 14, 1, 1, 30],
  '4': [2, 6, 10, 18, 31, 2, 2],
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [15, 16, 16, 16, 16, 16, 15],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [15, 16, 16, 19, 17, 17, 15],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [31, 4, 4, 4, 4, 4, 31],
  J: [7, 2, 2, 2, 18, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [15, 16, 16, 14, 1, 1, 30],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 17, 21, 27, 17],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
});

const COLORS = Object.freeze({
  background: '#0b0f16',
  panel: '#141a24',
  panelAlt: '#111721',
  border: '#344052',
  title: '#f4cf66',
  candidate: '#8fdcff',
  text: '#edf5ff',
  muted: '#9aa8b8',
  checkerA: '#202a37',
  checkerB: '#293646',
});

class PixelCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.rgba = Buffer.alloc(width * height * 4);
  }

  fillRect(x, y, width, height, fill) {
    if (![x, y, width, height].every(Number.isInteger) || x < 0 || y < 0 || width < 0 || height < 0 || x + width > this.width || y + height > this.height) {
      throw new TypeError('Review rectangle is outside the PNG canvas.');
    }
    const [red, green, blue, alpha] = hexToRgba(fill);
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      const offset = ((py * this.width) + px) * 4;
      this.rgba[offset] = red;
      this.rgba[offset + 1] = green;
      this.rgba[offset + 2] = blue;
      this.rgba[offset + 3] = alpha;
    }
  }

  textWidth(value, scale) {
    return Math.max(0, (value.length * 6 * scale) - scale);
  }

  drawText(value, x, y, scale, fill) {
    let cursor = x;
    for (const character of value.toUpperCase()) {
      const rows = FONT[character];
      if (!rows) throw new TypeError('Review font is missing glyph ' + character + '.');
      for (let row = 0; row < rows.length; row++) for (let column = 0; column < 5; column++) {
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
      const fill = pixels[(py * size) + px] || ((px + py) % 2 === 0 ? COLORS.checkerA : COLORS.checkerB);
      this.fillRect(x + (px * scale), y + (py * scale), scale, scale, fill);
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
const spec = Object.freeze({ kind: 'enemy', family: 'birdfolk', variant: 'stormcrown-exarch' });
const captures = new Map();
const candidateFrames = [];

function key(animation, direction, frame) {
  return [animation, direction, frame].join('/');
}

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_BIRDFOLK_STORMCROWN_EXARCH_REGISTRY,
    spec,
    direction,
    animation.id,
    frame,
  );
  captures.set(key(animation.id, direction, frame), captured);
  candidateFrames.push({
    family: 'birdfolk',
    variant: 'stormcrown-exarch',
    direction,
    animation: animation.id,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  });
}

function pixelsFor(animation, direction, frame, assembled) {
  const captured = captures.get(key(animation, direction, frame));
  return assembled
    ? buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_BIRDFOLK_STORMCROWN_EXARCH_DATA).formComplete
    : captured.pixels;
}

function renderBoard({ title, subtitle, assembled }) {
  const margin = 16;
  const labelWidth = 130;
  const scale = 3;
  const frameSize = ENEMY_EXPANSION_PROFILE.frameContract.cell * scale;
  const frameGap = 6;
  const groupWidth = (frameSize * 4) + (frameGap * 3);
  const directionGap = 14;
  const headerHeight = 96;
  const rowHeight = 108;
  const width = (margin * 2) + labelWidth + (groupWidth * directions.length) + (directionGap * (directions.length - 1));
  const height = headerHeight + (rowHeight * animations.length) + margin;
  const canvas = new PixelCanvas(width, height);
  const groupX = (index) => margin + labelWidth + (index * (groupWidth + directionGap));

  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel);
  canvas.drawText(title, margin, 14, 3, COLORS.title);
  canvas.drawText(subtitle, margin, 50, 1, COLORS.muted);
  for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
    canvas.drawCenteredText(directions[directionIndex], groupX(directionIndex) + (groupWidth / 2), 72, 2, COLORS.candidate);
  }

  for (let rowIndex = 0; rowIndex < animations.length; rowIndex++) {
    const animation = animations[rowIndex];
    const rowTop = headerHeight + (rowIndex * rowHeight);
    canvas.fillRect(margin, rowTop + 4, width - (margin * 2), rowHeight - 8, rowIndex % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.fillRect(margin, rowTop + 4, 5, rowHeight - 8, COLORS.candidate);
    canvas.drawText(animation.label, margin + 18, rowTop + 30, 2, COLORS.text);
    canvas.drawText(animation.frames + ' FRAMES', margin + 18, rowTop + 62, 1, COLORS.candidate);
    for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
      const actualWidth = (frameSize * animation.frames) + (frameGap * (animation.frames - 1));
      const startX = Math.round(groupX(directionIndex) + ((groupWidth - actualWidth) / 2));
      for (let frame = 0; frame < animation.frames; frame++) {
        const x = startX + (frame * (frameSize + frameGap));
        canvas.drawPixels(pixelsFor(animation.id, directions[directionIndex], frame, assembled), x, rowTop + 13, scale);
        canvas.drawCenteredText(animation.prefix + (frame + 1), x + (frameSize / 2), rowTop + 91, 1, COLORS.muted);
      }
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
  canvas.drawText('BIRDFOLK STORMCROWN EXARCH FULL ' + (assembled ? 'COMPLETE B + FORM' : 'RAW'), 12, 6, 2, COLORS.title);
  canvas.drawText('PHASE ' + (phase + 1), 12, 30, 1, COLORS.candidate);
  for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
    canvas.drawCenteredText(directions[directionIndex], labelWidth + (directionIndex * cellWidth) + (cellWidth / 2), 30, 1, COLORS.text);
  }

  for (let rowIndex = 0; rowIndex < animations.length; rowIndex++) {
    const animation = animations[rowIndex];
    const rowTop = headerHeight + (rowIndex * rowHeight);
    canvas.fillRect(0, rowTop, width, rowHeight, rowIndex % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.fillRect(0, rowTop, 5, rowHeight, COLORS.candidate);
    canvas.drawText(animation.label, 16, rowTop + 38, 2, COLORS.text);
    const frame = animation.sequence[phase];
    for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
      const cellX = labelWidth + (directionIndex * cellWidth);
      if (directionIndex > 0) canvas.fillRect(cellX, rowTop, 1, rowHeight, COLORS.border);
      canvas.drawPixels(pixelsFor(animation.id, directions[directionIndex], frame, assembled), cellX + 28, rowTop + 16, 3, false);
      canvas.drawCenteredText(animation.prefix + (frame + 1), cellX + (cellWidth / 2), rowTop + 88, 1, COLORS.muted);
    }
  }

  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

const rawBoard = renderBoard({
  title: 'EN-E04 BIRDFOLK STORMCROWN EXARCH FULL SUITE',
  subtitle: 'ONE COMPLETE ELITE IDLE WALK ATTACK CAST HURT DEATH FOUR DIRECTIONS',
  assembled: false,
});
const assembledBoard = renderBoard({
  title: 'EN-E04 COMPLETE B + FORM',
  subtitle: 'SAME BIRDFOLK STORMCROWN EXARCH FULL SUITE WITH APPROVED PRESENTATION',
  assembled: true,
});
const rawHash = createHash('sha256').update(rawBoard.png).digest('hex');
const assembledHash = createHash('sha256').update(assembledBoard.png).digest('hex');
const candidateFrameDigest = createHash('sha256').update(JSON.stringify(candidateFrames)).digest('hex');
const drift = [];
if (EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.artifactSha256 && rawHash !== EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.artifactSha256) drift.push('raw review expected ' + EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.artifactSha256 + ' but rendered ' + rawHash);
if (EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.assembledArtifactSha256 && assembledHash !== EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.assembledArtifactSha256) drift.push('Complete B + Form review expected ' + EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.assembledArtifactSha256 + ' but rendered ' + assembledHash);
if (EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.candidateFrameDigest && candidateFrameDigest !== EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.candidateFrameDigest) drift.push('frame digest expected ' + EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.candidateFrameDigest + ' but rendered ' + candidateFrameDigest);
if (drift.length) throw new Error('EN-E04 Birdfolk Stormcrown Exarch evidence drifted from the frozen candidate gate:\n- ' + drift.join('\n- '));

const report = {
  format: 'enemy-expansion-en-e04-birdfolk-stormcrown-exarch-full-v1',
  sliceId: 'EN-E04',
  state: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.status,
  artifact: path.basename(EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.artifact),
  png: { width: rawBoard.width, height: rawBoard.height, sha256: rawHash },
  assembledArtifact: path.basename(EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.assembledArtifact),
  assembledPng: { width: assembledBoard.width, height: assembledBoard.height, sha256: assembledHash },
  animationFrames: {
    raw: [1, 2, 3, 4].map((frame) => 'animation-frames/raw-' + frame + '.png'),
    completeBForm: [1, 2, 3, 4].map((frame) => 'animation-frames/complete-b-form-' + frame + '.png'),
    width: 640,
    height: 672,
    frameDurationMs: 180,
  },
  candidateFrameDigest,
  authorization: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE,
  candidateFrames,
  guarantees: {
    candidateFamilies: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_REGISTRY.families.length,
    candidateVariants: 1,
    candidateFrames: candidateFrames.length,
    publicCandidateFamilies: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_REGISTRY.publicFamilies.length,
    animationsRendered: animations.map((animation) => animation.id),
    directions,
    binaryAlpha: true,
    effectBoundary: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_DATA.effectBoundary,
    effects: 'off',
    assembledPresentation: ['Complete B', 'Form'],
  },
};

await mkdir(animationOutput, { recursive: true });
await writeFile(path.join(output, report.artifact), rawBoard.png);
await writeFile(path.join(output, report.assembledArtifact), assembledBoard.png);
for (let phase = 0; phase < 4; phase++) {
  await writeFile(path.join(animationOutput, 'raw-' + (phase + 1) + '.png'), renderAnimationFrame(phase, false).png);
  await writeFile(path.join(animationOutput, 'complete-b-form-' + (phase + 1) + '.png'), renderAnimationFrame(phase, true).png);
}
await writeFile(path.join(output, 'en-e04-birdfolk-stormcrown-exarch-full-review.json'), JSON.stringify(report, null, 2) + '\n');

console.log('Generated the bounded EN-E04 Birdfolk Stormcrown Exarch full-enemy evidence.');
console.log('- Raw PNG: ' + path.relative(root, path.join(output, report.artifact)) + ' (' + rawBoard.width + 'x' + rawBoard.height + ')');
console.log('- Raw PNG SHA-256: ' + rawHash);
console.log('- Complete B + Form PNG: ' + path.relative(root, path.join(output, report.assembledArtifact)) + ' (' + assembledBoard.width + 'x' + assembledBoard.height + ')');
console.log('- Complete B + Form PNG SHA-256: ' + assembledHash);
console.log('- Candidate frame digest: ' + candidateFrameDigest);
console.log('- Candidate scope: one complete elite enemy / 80 suite frames / four directions / external effects');
