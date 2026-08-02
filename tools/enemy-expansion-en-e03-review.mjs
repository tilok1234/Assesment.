import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  buildEnemyExpansionReviewPlan,
  ENEMY_EXPANSION_PROFILE,
} from '../engine/enemy-expansion.js';
import {
  EN_E03_CONTRACT_CARDS,
  EN_E03_IDLE_GATE,
  EN_E03_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e03');

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
  '8': [14, 17, 17, 14, 17, 17, 14],
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
  heading: '#8fdcff',
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

  drawPixels(pixels, x, y, scale) {
    const size = ENEMY_EXPANSION_PROFILE.frameContract.cell;
    this.fillRect(x - 2, y - 2, (size * scale) + 4, (size * scale) + 4, COLORS.border);
    for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
      const fill = pixels[(py * size) + px] || ((px + py) % 2 === 0 ? COLORS.checkerA : COLORS.checkerB);
      this.fillRect(x + (px * scale), y + (py * scale), scale, scale, fill);
    }
  }
}

const directions = ENEMY_EXPANSION_PROFILE.frameContract.directions;
const capturedFrames = new Map();
const frameRecords = [];
for (const card of EN_E03_CONTRACT_CARDS) {
  const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
  for (const direction of directions) for (let frame = 0; frame < 2; frame++) {
    const captured = captureEnemyExpansionFrame(EN_E03_IDLE_REGISTRY, spec, direction, 'idle', frame);
    capturedFrames.set([card.id, direction, frame].join('/'), captured);
    frameRecords.push({
      family: card.id,
      variant: card.baseline.variantId,
      direction,
      animation: 'idle',
      frame,
      digest: captured.digest,
      alphaDigest: captured.alphaDigest,
      opaquePixels: captured.opaquePixels,
      bounds: captured.bounds,
    });
  }
}

function renderBoard({ title, subtitle, assembled }) {
  const margin = 24;
  const labelWidth = 220;
  const reviewScale = 6;
  const frameSize = ENEMY_EXPANSION_PROFILE.frameContract.cell * reviewScale;
  const frameGap = 12;
  const pairWidth = (frameSize * 2) + frameGap;
  const directionGap = 20;
  const headerHeight = 112;
  const familyRowHeight = 196;
  const nativeHeaderHeight = 54;
  const nativeRowHeight = 34;
  const width = (margin * 2) + labelWidth + (pairWidth * 4) + (directionGap * 3);
  const nativeTop = headerHeight + (familyRowHeight * EN_E03_CONTRACT_CARDS.length);
  const height = nativeTop + nativeHeaderHeight + (nativeRowHeight * EN_E03_CONTRACT_CARDS.length) + margin;
  const canvas = new PixelCanvas(width, height);
  const pairX = (directionIndex) => margin + labelWidth + (directionIndex * (pairWidth + directionGap));
  const pixelsFor = (card, direction, frame) => {
    const captured = capturedFrames.get([card.id, direction, frame].join('/'));
    return assembled
      ? buildEnemyExpansionCandidatePresentation(captured.pixels, card.baseline.rendererData).formComplete
      : captured.pixels;
  };

  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel);
  canvas.drawText(title, margin, 16, 4, COLORS.title);
  canvas.drawText(subtitle, margin, 58, 2, COLORS.muted);
  for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
    canvas.drawCenteredText(directions[directionIndex], pairX(directionIndex) + (pairWidth / 2), 84, 2, COLORS.heading);
  }

  for (let familyIndex = 0; familyIndex < EN_E03_CONTRACT_CARDS.length; familyIndex++) {
    const card = EN_E03_CONTRACT_CARDS[familyIndex];
    const rowTop = headerHeight + (familyIndex * familyRowHeight);
    canvas.fillRect(margin, rowTop + 4, width - (margin * 2), familyRowHeight - 8, familyIndex % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.fillRect(margin, rowTop + 4, 5, familyRowHeight - 8, COLORS.heading);
    canvas.drawText(card.name, margin + 18, rowTop + 40, 3, COLORS.text);
    const baselineName = card.variantBriefs.find((variant) => variant.id === card.baseline.variantId).name;
    canvas.drawText(baselineName, margin + 18, rowTop + 78, 2, COLORS.title);
    canvas.drawText('COMMON ONLY', margin + 18, rowTop + 108, 2, COLORS.muted);
    for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
      const direction = directions[directionIndex];
      const x = pairX(directionIndex);
      for (let frame = 0; frame < 2; frame++) {
        canvas.drawPixels(pixelsFor(card, direction, frame), x + (frame * (frameSize + frameGap)), rowTop + 26, reviewScale);
      }
      canvas.drawCenteredText('F1', x + (frameSize / 2), rowTop + 176, 1, COLORS.muted);
      canvas.drawCenteredText('F2', x + frameSize + frameGap + (frameSize / 2), rowTop + 176, 1, COLORS.muted);
    }
  }

  canvas.fillRect(0, nativeTop, width, nativeHeaderHeight + (nativeRowHeight * EN_E03_CONTRACT_CARDS.length), COLORS.panel);
  canvas.drawText('NATIVE 24X24', margin, nativeTop + 18, 2, COLORS.title);
  canvas.drawText('SAME 24 FRAMES AT TRUE PIXEL SIZE', margin + 220, nativeTop + 18, 2, COLORS.muted);
  for (let familyIndex = 0; familyIndex < EN_E03_CONTRACT_CARDS.length; familyIndex++) {
    const card = EN_E03_CONTRACT_CARDS[familyIndex];
    const y = nativeTop + nativeHeaderHeight + (familyIndex * nativeRowHeight) + 4;
    canvas.drawText(card.name, margin, y + 6, 2, COLORS.text);
    for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
      const direction = directions[directionIndex];
      const x = pairX(directionIndex);
      for (let frame = 0; frame < 2; frame++) canvas.drawPixels(pixelsFor(card, direction, frame), x + (frame * 30), y, 1);
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

const rawBoard = renderBoard({
  title: 'EN-E03 IDLE VISUAL GATE',
  subtitle: 'RAW SOURCE - F1 / F2 - HARD ALPHA - EFFECTS OFF',
  assembled: false,
});
const assembledBoard = renderBoard({
  title: 'EN-E03 COMPLETE B + FORM',
  subtitle: 'ASSEMBLED REVIEW - SAME F1 / F2 SOURCE PIXELS',
  assembled: true,
});
const rawHash = createHash('sha256').update(rawBoard.png).digest('hex');
const assembledHash = createHash('sha256').update(assembledBoard.png).digest('hex');
const candidateFrameDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
if (rawHash !== EN_E03_IDLE_GATE.artifactSha256) throw new Error('EN-E03 raw review PNG drifted from the frozen gate hash.');
if (assembledHash !== EN_E03_IDLE_GATE.assembledArtifactSha256) throw new Error('EN-E03 Complete B + Form review PNG drifted from the frozen gate hash.');
if (candidateFrameDigest !== EN_E03_IDLE_GATE.candidateFrameDigest) throw new Error('EN-E03 Idle frame digest drifted from the frozen gate hash.');
const reviewPlan = buildEnemyExpansionReviewPlan(EN_E03_IDLE_REGISTRY, { sliceId: 'EN-E03' });
const report = {
  format: 'enemy-expansion-idle-review-v2',
  sliceId: 'EN-E03',
  state: 'implementation-candidate',
  artifact: 'en-e03-idle-review.png',
  png: { width: rawBoard.width, height: rawBoard.height, sha256: rawHash },
  assembledArtifact: 'en-e03-idle-complete-b-form-review.png',
  assembledPng: { width: assembledBoard.width, height: assembledBoard.height, sha256: assembledHash },
  candidateFrameDigest,
  approval: EN_E03_IDLE_GATE,
  contractCards: EN_E03_CONTRACT_CARDS,
  reviewPlan,
  frames: frameRecords,
  guarantees: {
    internalFamilies: EN_E03_IDLE_REGISTRY.families.length,
    publicFamilies: EN_E03_IDLE_REGISTRY.publicFamilies.length,
    implementedVariants: 3,
    specialistVariantsImplemented: 0,
    eliteVariantsImplemented: 0,
    animationsRendered: ['idle'],
    directions,
    binaryAlpha: true,
    effects: 'off',
    assembledPresentation: ['Complete B', 'Form'],
  },
};

await mkdir(output, { recursive: true });
await writeFile(path.join(output, report.artifact), rawBoard.png);
await writeFile(path.join(output, report.assembledArtifact), assembledBoard.png);
await writeFile(path.join(output, 'en-e03-idle-review.json'), JSON.stringify(report, null, 2) + '\n');

console.log('Generated EN-E03 common-only Idle visual-gate evidence.');
console.log('- Raw PNG: ' + path.relative(root, path.join(output, report.artifact)) + ' (' + rawBoard.width + 'x' + rawBoard.height + ')');
console.log('- Raw PNG SHA-256: ' + rawHash);
console.log('- Complete B + Form PNG: ' + path.relative(root, path.join(output, report.assembledArtifact)) + ' (' + assembledBoard.width + 'x' + assembledBoard.height + ')');
console.log('- Complete B + Form PNG SHA-256: ' + assembledHash);
console.log('- Candidate frame digest: ' + candidateFrameDigest);
console.log('- Families: 3 internal / 0 public');
console.log('- Frames: 24 common-only Idle candidates');
