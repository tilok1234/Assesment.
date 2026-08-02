import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  ENEMY_EXPANSION_PROFILE,
} from '../engine/enemy-expansion.js';
import {
  EN_E01_CANDIDATE_REGISTRY,
  EN_E01_CONTRACT_CARDS,
  EN_E01_IDLE_GATE,
} from '../engine/enemy-expansion-en-e01.js';
import {
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e01-full');

const FONT = Object.freeze({
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '-': [0, 0, 0, 31, 0, 0, 0],
  '/': [1, 2, 2, 4, 8, 8, 16],
  '0': [14, 17, 19, 21, 25, 17, 14],
  '1': [4, 12, 4, 4, 4, 4, 14],
  '2': [14, 17, 1, 2, 4, 8, 31],
  '3': [30, 1, 1, 14, 1, 1, 30],
  '4': [2, 6, 10, 18, 31, 2, 2],
  '5': [31, 16, 16, 30, 1, 1, 30],
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
  common: '#91d17a',
  specialist: '#72b7ef',
  elite: '#d995e8',
  checkerA: '#202a37',
  checkerB: '#293646',
});

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function createCanvas(width, height, background = null) {
  const rgba = Buffer.alloc(width * height * 4);
  function fillRect(x, y, rectWidth, rectHeight, color) {
    assert(Number.isInteger(x) && Number.isInteger(y) && Number.isInteger(rectWidth) && Number.isInteger(rectHeight), 'Review rectangles must use integer geometry.');
    assert(x >= 0 && y >= 0 && rectWidth >= 0 && rectHeight >= 0 && x + rectWidth <= width && y + rectHeight <= height, 'Review rectangle is outside the PNG canvas.');
    const [red, green, blue, alpha] = hexToRgba(color);
    for (let py = y; py < y + rectHeight; py++) for (let px = x; px < x + rectWidth; px++) {
      const offset = ((py * width) + px) * 4;
      rgba[offset] = red;
      rgba[offset + 1] = green;
      rgba[offset + 2] = blue;
      rgba[offset + 3] = alpha;
    }
  }
  function textWidth(value, scale) {
    return Math.max(0, (value.length * 6 * scale) - scale);
  }
  function drawText(value, x, y, scale, color) {
    let cursor = x;
    for (const character of value.toUpperCase()) {
      const rows = FONT[character];
      assert(rows, 'Review font is missing glyph ' + character + '.');
      for (let row = 0; row < rows.length; row++) for (let column = 0; column < 5; column++) {
        if (rows[row] & (1 << (4 - column))) fillRect(cursor + (column * scale), y + (row * scale), scale, scale, color);
      }
      cursor += 6 * scale;
    }
  }
  function drawCenteredText(value, centerX, y, scale, color) {
    drawText(value, Math.round(centerX - (textWidth(value, scale) / 2)), y, scale, color);
  }
  function drawFrame(frame, x, y, scale) {
    const size = ENEMY_EXPANSION_PROFILE.frameContract.cell;
    fillRect(x - 2, y - 2, (size * scale) + 4, (size * scale) + 4, COLORS.border);
    for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
      const color = frame.pixels[(py * size) + px] || ((px + py) % 2 === 0 ? COLORS.checkerA : COLORS.checkerB);
      fillRect(x + (px * scale), y + (py * scale), scale, scale, color);
    }
  }
  if (background) fillRect(0, 0, width, height, background);
  return { rgba, fillRect, textWidth, drawText, drawCenteredText, drawFrame };
}

function roleColor(role) {
  return COLORS[role] || COLORS.text;
}

function posix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

const directions = ENEMY_EXPANSION_PROFILE.frameContract.directions;
const animations = ENEMY_EXPANSION_PROFILE.frameContract.animations;
const frames = new Map();
const frameRecords = [];
for (const card of EN_E01_CONTRACT_CARDS) for (const variant of card.variantBriefs) {
  const spec = { kind: 'enemy', family: card.id, variant: variant.id };
  for (const direction of directions) for (const animation of animations) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const captured = captureEnemyExpansionFrame(EN_E01_CANDIDATE_REGISTRY, spec, direction, animation.id, frame);
      frames.set([card.id, variant.id, direction, animation.id, frame].join('/'), captured);
      frameRecords.push({
        family: card.id,
        variant: variant.id,
        direction,
        animation: animation.id,
        frame,
        digest: captured.digest,
        alphaDigest: captured.alphaDigest,
        opaquePixels: captured.opaquePixels,
        bounds: captured.bounds,
      });
    }
  }
}

const fullFrameDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
const artifacts = [];
await mkdir(output, { recursive: true });

const overviewScale = 4;
const overviewFrame = ENEMY_EXPANSION_PROFILE.frameContract.cell * overviewScale;
const overviewFrameGap = 8;
const overviewPairWidth = (overviewFrame * 2) + overviewFrameGap;
const overviewDirectionGap = 16;
const overviewMargin = 20;
const overviewLabelWidth = 260;
const overviewHeader = 104;
const overviewRowHeight = 124;
const variantRows = EN_E01_CONTRACT_CARDS.flatMap((card) => card.variantBriefs.map((variant) => ({ card, variant })));
const overviewWidth = (overviewMargin * 2) + overviewLabelWidth + (overviewPairWidth * directions.length) + (overviewDirectionGap * (directions.length - 1));
const overviewHeight = overviewHeader + (overviewRowHeight * variantRows.length) + overviewMargin;
const overview = createCanvas(overviewWidth, overviewHeight, COLORS.background);
overview.fillRect(0, 0, overviewWidth, overviewHeader - 8, COLORS.panel);
overview.drawText('EN-E01 FULL VARIANT OVERVIEW', overviewMargin, 16, 4, COLORS.title);
overview.drawText('IDLE F1 / F2 - 5 FAMILIES - 15 PRIVATE VARIANTS - EFFECTS OFF', overviewMargin, 58, 2, COLORS.muted);
const overviewPairX = (directionIndex) => overviewMargin + overviewLabelWidth + (directionIndex * (overviewPairWidth + overviewDirectionGap));
for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
  overview.drawCenteredText(directions[directionIndex], overviewPairX(directionIndex) + (overviewPairWidth / 2), 82, 2, COLORS.heading);
}
for (let rowIndex = 0; rowIndex < variantRows.length; rowIndex++) {
  const { card, variant } = variantRows[rowIndex];
  const rowTop = overviewHeader + (rowIndex * overviewRowHeight);
  overview.fillRect(overviewMargin, rowTop + 4, overviewWidth - (overviewMargin * 2), overviewRowHeight - 8, rowIndex % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
  overview.fillRect(overviewMargin, rowTop + 4, 5, overviewRowHeight - 8, roleColor(variant.role));
  overview.drawText(card.name, overviewMargin + 18, rowTop + 24, 2, COLORS.text);
  const variantScale = overview.textWidth(variant.name, 2) <= overviewLabelWidth - 36 ? 2 : 1;
  overview.drawText(variant.name, overviewMargin + 18, rowTop + 52, variantScale, COLORS.title);
  overview.drawText(variant.role, overviewMargin + 18, rowTop + 84, 1, roleColor(variant.role));
  for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
    const direction = directions[directionIndex];
    const x = overviewPairX(directionIndex);
    for (let frame = 0; frame < 2; frame++) {
      overview.drawFrame(frames.get([card.id, variant.id, direction, 'idle', frame].join('/')), x + (frame * (overviewFrame + overviewFrameGap)), rowTop + 14, overviewScale);
    }
  }
}
const overviewPng = encodeRgbaPng(overviewWidth, overviewHeight, overview.rgba);
const overviewName = 'en-e01-full-overview.png';
await writeFile(path.join(output, overviewName), overviewPng);
artifacts.push({ type: 'overview', path: overviewName, width: overviewWidth, height: overviewHeight, sha256: createHash('sha256').update(overviewPng).digest('hex') });

const uniqueMotionFrames = [
  ['idle', 0, 'I1'], ['idle', 1, 'I2'],
  ['walk', 0, 'W1'], ['walk', 1, 'W2'], ['walk', 2, 'W3'], ['walk', 3, 'W4'],
  ['attack', 0, 'A1'], ['attack', 1, 'A2'], ['attack', 2, 'A3'], ['attack', 3, 'A4'],
  ['hurt', 0, 'H1'], ['hurt', 1, 'H2'],
];
const motionScale = 4;
const motionFrame = ENEMY_EXPANSION_PROFILE.frameContract.cell * motionScale;
const motionGap = 6;
const motionMargin = 20;
const motionLabelWidth = 250;
const motionHeader = 122;
const motionRowHeight = 116;
const motionWidth = (motionMargin * 2) + motionLabelWidth + (uniqueMotionFrames.length * motionFrame) + ((uniqueMotionFrames.length - 1) * motionGap);
const motionHeight = motionHeader + (12 * motionRowHeight) + motionMargin;

for (const card of EN_E01_CONTRACT_CARDS) {
  const canvas = createCanvas(motionWidth, motionHeight, COLORS.background);
  canvas.fillRect(0, 0, motionWidth, motionHeader - 8, COLORS.panel);
  canvas.drawText(card.name + ' FULL MOTION REVIEW', motionMargin, 16, 3, COLORS.title);
  canvas.drawText('CAST IS ATTACK / DEATH IS HURT 1 2 2 2 / EFFECTS OFF', motionMargin, 48, 2, COLORS.muted);
  canvas.drawText('EVERY UNIQUE STANDARD ENEMY FRAME - 3 VARIANTS - 4 DIRECTIONS', motionMargin, 74, 2, COLORS.muted);
  for (let column = 0; column < uniqueMotionFrames.length; column++) {
    const x = motionMargin + motionLabelWidth + (column * (motionFrame + motionGap));
    canvas.drawCenteredText(uniqueMotionFrames[column][2], x + (motionFrame / 2), 104, 1, COLORS.heading);
  }
  let rowIndex = 0;
  for (const variant of card.variantBriefs) for (const direction of directions) {
    const rowTop = motionHeader + (rowIndex * motionRowHeight);
    canvas.fillRect(motionMargin, rowTop + 4, motionWidth - (motionMargin * 2), motionRowHeight - 8, rowIndex % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.fillRect(motionMargin, rowTop + 4, 5, motionRowHeight - 8, roleColor(variant.role));
    const variantScale = canvas.textWidth(variant.name, 2) <= motionLabelWidth - 36 ? 2 : 1;
    canvas.drawText(variant.name, motionMargin + 18, rowTop + 22, variantScale, COLORS.text);
    canvas.drawText(variant.role, motionMargin + 18, rowTop + 52, 1, roleColor(variant.role));
    canvas.drawText(direction, motionMargin + 18, rowTop + 72, 1, COLORS.heading);
    for (let column = 0; column < uniqueMotionFrames.length; column++) {
      const [animation, frame] = uniqueMotionFrames[column];
      const x = motionMargin + motionLabelWidth + (column * (motionFrame + motionGap));
      canvas.drawFrame(frames.get([card.id, variant.id, direction, animation, frame].join('/')), x, rowTop + 10, motionScale);
    }
    rowIndex++;
  }
  const png = encodeRgbaPng(motionWidth, motionHeight, canvas.rgba);
  const filename = card.id + '-motion-review.png';
  await writeFile(path.join(output, filename), png);
  artifacts.push({ type: 'family-motion', family: card.id, path: filename, width: motionWidth, height: motionHeight, sha256: createHash('sha256').update(png).digest('hex') });
}

const sheetWidth = ENEMY_EXPANSION_PROFILE.frameContract.width;
const sheetHeight = ENEMY_EXPANSION_PROFILE.frameContract.height;
for (const card of EN_E01_CONTRACT_CARDS) for (const variant of card.variantBriefs) {
  const sheetRgba = Buffer.alloc(sheetWidth * sheetHeight * 4);
  for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
    const direction = directions[directionIndex];
    let column = 0;
    for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
      const captured = frames.get([card.id, variant.id, direction, animation.id, frame].join('/'));
      for (let py = 0; py < captured.height; py++) for (let px = 0; px < captured.width; px++) {
        const color = captured.pixels[(py * captured.width) + px];
        if (!color) continue;
        const [red, green, blue] = hexToRgba(color);
        const targetX = (column * captured.width) + px;
        const targetY = (directionIndex * captured.height) + py;
        const offset = ((targetY * sheetWidth) + targetX) * 4;
        sheetRgba[offset] = red;
        sheetRgba[offset + 1] = green;
        sheetRgba[offset + 2] = blue;
        sheetRgba[offset + 3] = 255;
      }
      column++;
    }
  }
  const png = encodeRgbaPng(sheetWidth, sheetHeight, sheetRgba);
  const relativePath = path.join('sheets', card.id, variant.id + '.png');
  const absolutePath = path.join(output, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, png);
  artifacts.push({ type: 'native-sheet', family: card.id, variant: variant.id, path: posix(relativePath), width: sheetWidth, height: sheetHeight, sha256: createHash('sha256').update(png).digest('hex') });
}

const report = {
  format: 'enemy-expansion-full-review-v1',
  sliceId: 'EN-E01',
  state: 'full-production-candidate',
  approvedIdleGate: EN_E01_IDLE_GATE,
  fullFrameDigest,
  counts: {
    families: 5,
    variants: 15,
    completeSheets: 15,
    frames: frameRecords.length,
    publicFamilies: EN_E01_CANDIDATE_REGISTRY.publicFamilies.length,
  },
  aliases: {
    cast: 'attack',
    death: ['hurt:0', 'hurt:1', 'hurt:1', 'hurt:1'],
  },
  artifacts,
  frames: frameRecords,
};
await writeFile(path.join(output, 'en-e01-full-review.json'), JSON.stringify(report, null, 2) + '\n');

console.log('Generated EN-E01 full-production review evidence.');
console.log('- Overview: ' + posix(path.join('enemy-expansion-review', 'en-e01-full', overviewName)) + ' (' + overviewWidth + 'x' + overviewHeight + ')');
console.log('- Family motion reviews: 5');
console.log('- Native complete sheets: 15 (480x96)');
console.log('- Frames: ' + frameRecords.length);
console.log('- Public expansion families: 0');
console.log('- Full candidate frame digest: ' + fullFrameDigest);
