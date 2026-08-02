import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  buildEnemyExpansionReviewPlan,
  ENEMY_EXPANSION_PROFILE,
} from '../engine/enemy-expansion.js';
import {
  EN_E02_CONTRACT_CARDS,
  EN_E02_IDLE_GATE,
  EN_E02_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e02.js';
import {
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e02');

const FONT = Object.freeze({
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '-': [0, 0, 0, 31, 0, 0, 0],
  '/': [1, 2, 2, 4, 8, 8, 16],
  '0': [14, 17, 19, 21, 25, 17, 14],
  '1': [4, 12, 4, 4, 4, 4, 14],
  '2': [14, 17, 1, 2, 4, 8, 31],
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
  heading: '#8fdcff',
  text: '#edf5ff',
  muted: '#9aa8b8',
  checkerA: '#202a37',
  checkerB: '#293646',
});

const MARGIN = 24;
const LABEL_WIDTH = 220;
const REVIEW_SCALE = 6;
const FRAME_SIZE = ENEMY_EXPANSION_PROFILE.frameContract.cell * REVIEW_SCALE;
const FRAME_GAP = 12;
const PAIR_WIDTH = (FRAME_SIZE * 2) + FRAME_GAP;
const DIRECTION_GAP = 20;
const HEADER_HEIGHT = 112;
const FAMILY_ROW_HEIGHT = 196;
const NATIVE_HEADER_HEIGHT = 54;
const NATIVE_ROW_HEIGHT = 34;
const WIDTH = (MARGIN * 2) + LABEL_WIDTH + (PAIR_WIDTH * 4) + (DIRECTION_GAP * 3);
const NATIVE_TOP = HEADER_HEIGHT + (FAMILY_ROW_HEIGHT * EN_E02_CONTRACT_CARDS.length);
const HEIGHT = NATIVE_TOP + NATIVE_HEADER_HEIGHT + (NATIVE_ROW_HEIGHT * EN_E02_CONTRACT_CARDS.length) + MARGIN;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

const rgba = Buffer.alloc(WIDTH * HEIGHT * 4);

function fillRect(x, y, width, height, color) {
  assert(Number.isInteger(x) && Number.isInteger(y) && Number.isInteger(width) && Number.isInteger(height), 'Review rectangles must use integer geometry.');
  assert(x >= 0 && y >= 0 && width >= 0 && height >= 0 && x + width <= WIDTH && y + height <= HEIGHT, 'Review rectangle is outside the PNG canvas.');
  const [red, green, blue, alpha] = hexToRgba(color);
  for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
    const offset = ((py * WIDTH) + px) * 4;
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
  const upper = value.toUpperCase();
  let cursor = x;
  for (const character of upper) {
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

function pairX(directionIndex) {
  return MARGIN + LABEL_WIDTH + (directionIndex * (PAIR_WIDTH + DIRECTION_GAP));
}

fillRect(0, 0, WIDTH, HEIGHT, COLORS.background);
fillRect(0, 0, WIDTH, HEADER_HEIGHT - 8, COLORS.panel);
drawText('EN-E02 IDLE VISUAL GATE', MARGIN, 16, 4, COLORS.title);
drawText('F1 / F2 - HARD ALPHA - EFFECTS OFF - INTERNAL CANDIDATES', MARGIN, 58, 2, COLORS.muted);

const directions = ENEMY_EXPANSION_PROFILE.frameContract.directions;
for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
  drawCenteredText(directions[directionIndex], pairX(directionIndex) + (PAIR_WIDTH / 2), 84, 2, COLORS.heading);
}

const frames = new Map();
const frameRecords = [];
for (let familyIndex = 0; familyIndex < EN_E02_CONTRACT_CARDS.length; familyIndex++) {
  const card = EN_E02_CONTRACT_CARDS[familyIndex];
  const rowTop = HEADER_HEIGHT + (familyIndex * FAMILY_ROW_HEIGHT);
  fillRect(MARGIN, rowTop + 4, WIDTH - (MARGIN * 2), FAMILY_ROW_HEIGHT - 8, familyIndex % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
  fillRect(MARGIN, rowTop + 4, 5, FAMILY_ROW_HEIGHT - 8, COLORS.heading);
  const familyNameScale = textWidth(card.name, 3) <= LABEL_WIDTH - 36 ? 3 : 2;
  drawText(card.name, MARGIN + 18, rowTop + 40, familyNameScale, COLORS.text);
  const baselineName = card.variantBriefs.find((variant) => variant.id === card.baseline.variantId).name;
  drawText(baselineName, MARGIN + 18, rowTop + 78, 2, COLORS.title);
  drawText('COMMON ONLY', MARGIN + 18, rowTop + 108, 2, COLORS.muted);

  const spec = { kind: 'enemy', family: card.id, variant: card.baseline.variantId };
  for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
    const direction = directions[directionIndex];
    const x = pairX(directionIndex);
    for (let frame = 0; frame < 2; frame++) {
      const captured = captureEnemyExpansionFrame(EN_E02_IDLE_REGISTRY, spec, direction, 'idle', frame);
      const key = [card.id, direction, frame].join('/');
      frames.set(key, captured);
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
      drawFrame(captured, x + (frame * (FRAME_SIZE + FRAME_GAP)), rowTop + 26, REVIEW_SCALE);
    }
    drawCenteredText('F1', x + (FRAME_SIZE / 2), rowTop + 176, 1, COLORS.muted);
    drawCenteredText('F2', x + FRAME_SIZE + FRAME_GAP + (FRAME_SIZE / 2), rowTop + 176, 1, COLORS.muted);
  }
}

fillRect(0, NATIVE_TOP, WIDTH, NATIVE_HEADER_HEIGHT + (NATIVE_ROW_HEIGHT * EN_E02_CONTRACT_CARDS.length), COLORS.panel);
drawText('NATIVE 24X24', MARGIN, NATIVE_TOP + 18, 2, COLORS.title);
drawText('SAME 40 FRAMES AT TRUE PIXEL SIZE', MARGIN + 220, NATIVE_TOP + 18, 2, COLORS.muted);

for (let familyIndex = 0; familyIndex < EN_E02_CONTRACT_CARDS.length; familyIndex++) {
  const card = EN_E02_CONTRACT_CARDS[familyIndex];
  const y = NATIVE_TOP + NATIVE_HEADER_HEIGHT + (familyIndex * NATIVE_ROW_HEIGHT) + 4;
  drawText(card.name, MARGIN, y + 6, 2, COLORS.text);
  for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
    const direction = directions[directionIndex];
    const x = pairX(directionIndex);
    for (let frame = 0; frame < 2; frame++) {
      drawFrame(frames.get([card.id, direction, frame].join('/')), x + (frame * 30), y, 1);
    }
  }
}

const png = encodeRgbaPng(WIDTH, HEIGHT, rgba);
const pngHash = createHash('sha256').update(png).digest('hex');
const candidateFrameDigest = createHash('sha256').update(JSON.stringify(frameRecords.map((record) => ({
  family: record.family,
  direction: record.direction,
  frame: record.frame,
  digest: record.digest,
  alphaDigest: record.alphaDigest,
  opaquePixels: record.opaquePixels,
  bounds: record.bounds,
})))).digest('hex');
const reviewPlan = buildEnemyExpansionReviewPlan(EN_E02_IDLE_REGISTRY, { sliceId: 'EN-E02' });
const report = {
  format: 'enemy-expansion-idle-review-v1',
  sliceId: 'EN-E02',
  state: 'implementation-candidate',
  artifact: 'en-e02-idle-review.png',
  png: { width: WIDTH, height: HEIGHT, sha256: pngHash },
  candidateFrameDigest,
  approval: EN_E02_IDLE_GATE,
  contractCards: EN_E02_CONTRACT_CARDS,
  reviewPlan,
  frames: frameRecords,
  guarantees: {
    internalFamilies: EN_E02_IDLE_REGISTRY.families.length,
    publicFamilies: EN_E02_IDLE_REGISTRY.publicFamilies.length,
    implementedVariants: EN_E02_IDLE_REGISTRY.families.reduce((count, family) => count + family.variants.length, 0),
    specialistVariantsImplemented: 0,
    eliteVariantsImplemented: 0,
    animationsRendered: ['idle'],
    directions,
    binaryAlpha: true,
    effects: 'off',
  },
};

await mkdir(output, { recursive: true });
await writeFile(path.join(output, report.artifact), png);
await writeFile(path.join(output, 'en-e02-idle-review.json'), JSON.stringify(report, null, 2) + '\n');

console.log('Generated EN-E02 Idle visual-gate evidence.');
console.log('- PNG: ' + path.relative(root, path.join(output, report.artifact)) + ' (' + WIDTH + 'x' + HEIGHT + ')');
console.log('- PNG SHA-256: ' + pngHash);
console.log('- Candidate frame digest: ' + candidateFrameDigest);
console.log('- Families: 5 internal / 0 public');
console.log('- Frames: 40 Idle candidates');
