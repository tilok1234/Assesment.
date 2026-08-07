import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ENEMY_EXPANSION_PROFILE } from '../engine/enemy-expansion.js';
import {
  EN_E03_SUN_LANCER_IDLE_GATE,
  EN_E03_SUN_LANCER_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-specialist-idle.js';
import { EN_E03_CENTAUR_IDLE_REGISTRY } from '../engine/enemy-expansion-en-e03-centaur-idle.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e03-sun-lancer-idle');
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
  candidate: '#8fdcff',
  approved: '#8ee39a',
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

function variantData(registry, familyId, variantId) {
  const family = registry.families.find((entry) => entry.id === familyId);
  const variant = family?.variants.find((entry) => entry.id === variantId);
  if (!variant) throw new TypeError('Missing comparison variant ' + familyId + '/' + variantId + '.');
  return variant.rendererData;
}

const rows = Object.freeze([
  {
    role: 'candidate',
    familyLabel: 'CENTAUR SPECIALIST',
    variantLabel: 'SUN LANCER',
    statusLabel: 'IDLE CANDIDATE',
    registry: EN_E03_SUN_LANCER_IDLE_REGISTRY,
    family: 'centaur',
    variant: 'sun-lancer',
  },
  {
    role: 'approved',
    familyLabel: 'CENTAUR COMMON',
    variantLabel: 'STEPPE HUNTER',
    statusLabel: 'APPROVED COMMON',
    registry: EN_E03_CENTAUR_IDLE_REGISTRY,
    family: 'centaur',
    variant: 'steppe-hunter',
  },
].map((row) => Object.freeze({
  ...row,
  rendererData: variantData(row.registry, row.family, row.variant),
})));

const directions = ENEMY_EXPANSION_PROFILE.frameContract.directions;
const captures = new Map();
const candidateFrames = [];
const referenceFrames = [];
for (const row of rows) for (const direction of directions) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    row.registry,
    { kind: 'enemy', family: row.family, variant: row.variant },
    direction,
    'idle',
    frame,
  );
  captures.set([row.variant, direction, frame].join('/'), captured);
  const record = {
    family: row.family,
    variant: row.variant,
    direction,
    animation: 'idle',
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
  (row.role === 'candidate' ? candidateFrames : referenceFrames).push(record);
}

function pixelsFor(row, direction, frame, assembled) {
  const captured = captures.get([row.variant, direction, frame].join('/'));
  return assembled
    ? buildEnemyExpansionCandidatePresentation(captured.pixels, row.rendererData).formComplete
    : captured.pixels;
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
  const rowHeight = 196;
  const nativeHeaderHeight = 54;
  const nativeRowHeight = 34;
  const width = (margin * 2) + labelWidth + (pairWidth * directions.length) + (directionGap * (directions.length - 1));
  const nativeTop = headerHeight + (rowHeight * rows.length);
  const height = nativeTop + nativeHeaderHeight + (nativeRowHeight * rows.length) + margin;
  const canvas = new PixelCanvas(width, height);
  const pairX = (index) => margin + labelWidth + (index * (pairWidth + directionGap));

  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel);
  canvas.drawText(title, margin, 16, 4, COLORS.title);
  canvas.drawText(subtitle, margin, 58, 2, COLORS.muted);
  for (let index = 0; index < directions.length; index++) {
    canvas.drawCenteredText(directions[index], pairX(index) + (pairWidth / 2), 84, 2, COLORS.candidate);
  }

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const rowTop = headerHeight + (rowIndex * rowHeight);
    const accent = row.role === 'candidate' ? COLORS.candidate : COLORS.approved;
    canvas.fillRect(margin, rowTop + 4, width - (margin * 2), rowHeight - 8, rowIndex % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.fillRect(margin, rowTop + 4, 5, rowHeight - 8, accent);
    canvas.drawText(row.familyLabel, margin + 18, rowTop + 34, 2, COLORS.text);
    canvas.drawText(row.variantLabel, margin + 18, rowTop + 68, 2, COLORS.title);
    canvas.drawText(row.statusLabel, margin + 18, rowTop + 100, 2, accent);
    for (let index = 0; index < directions.length; index++) {
      const x = pairX(index);
      for (let frame = 0; frame < 2; frame++) canvas.drawPixels(pixelsFor(row, directions[index], frame, assembled), x + (frame * (frameSize + frameGap)), rowTop + 26, reviewScale);
      canvas.drawCenteredText('F1', x + (frameSize / 2), rowTop + 176, 1, COLORS.muted);
      canvas.drawCenteredText('F2', x + frameSize + frameGap + (frameSize / 2), rowTop + 176, 1, COLORS.muted);
    }
  }

  canvas.fillRect(0, nativeTop, width, nativeHeaderHeight + (nativeRowHeight * rows.length), COLORS.panel);
  canvas.drawText('NATIVE 24X24', margin, nativeTop + 18, 2, COLORS.title);
  canvas.drawText('SAME POSES AT TRUE PIXEL SIZE', margin + 220, nativeTop + 18, 2, COLORS.muted);
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const y = nativeTop + nativeHeaderHeight + (rowIndex * nativeRowHeight) + 4;
    canvas.drawText(row.variantLabel, margin, y + 6, 2, row.role === 'candidate' ? COLORS.candidate : COLORS.text);
    for (let index = 0; index < directions.length; index++) {
      const x = pairX(index);
      for (let frame = 0; frame < 2; frame++) canvas.drawPixels(pixelsFor(row, directions[index], frame, assembled), x + (frame * 30), y, 1);
    }
  }

  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

function renderAnimationFrame(frame, assembled) {
  const width = 192;
  const height = 224;
  const headerHeight = 32;
  const panelWidth = 96;
  const panelHeight = 96;
  const canvas = new PixelCanvas(width, height);
  const positions = [[0, 32], [96, 32], [0, 128], [96, 128]];
  const candidate = rows[0];

  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight, COLORS.panel);
  canvas.drawCenteredText('SUN LANCER IDLE', width / 2, 4, 1, COLORS.title);
  canvas.drawCenteredText('F' + (frame + 1) + (assembled ? ' COMPLETE B + FORM' : ' RAW'), width / 2, 17, 1, assembled ? COLORS.approved : COLORS.candidate);
  for (let index = 0; index < directions.length; index++) {
    const [panelX, panelY] = positions[index];
    canvas.fillRect(panelX, panelY, panelWidth, panelHeight, index % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    if (panelX > 0) canvas.fillRect(panelX, panelY, 1, panelHeight, COLORS.border);
    if (panelY > headerHeight) canvas.fillRect(panelX, panelY, panelWidth, 1, COLORS.border);
    canvas.drawCenteredText(directions[index], panelX + (panelWidth / 2), panelY + 5, 2, COLORS.text);
    canvas.drawPixels(pixelsFor(candidate, directions[index], frame, assembled), panelX + 12, panelY + 20, 3, false);
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

const rawBoard = renderBoard({
  title: 'EN-E03 SUN LANCER IDLE',
  subtitle: 'SPECIALIST F1 F2 FOUR DIRECTIONS BESIDE APPROVED STEPPE HUNTER',
  assembled: false,
});
const assembledBoard = renderBoard({
  title: 'EN-E03 COMPLETE B + FORM',
  subtitle: 'SAME SPECIALIST SOURCE AND APPROVED CENTAUR REFERENCE',
  assembled: true,
});
const rawHash = createHash('sha256').update(rawBoard.png).digest('hex');
const assembledHash = createHash('sha256').update(assembledBoard.png).digest('hex');
const candidateFrameDigest = createHash('sha256').update(JSON.stringify(candidateFrames)).digest('hex');
const referenceFrameDigest = createHash('sha256').update(JSON.stringify(referenceFrames)).digest('hex');
const drift = [];
if (EN_E03_SUN_LANCER_IDLE_GATE.artifactSha256 && rawHash !== EN_E03_SUN_LANCER_IDLE_GATE.artifactSha256) drift.push('raw review expected ' + EN_E03_SUN_LANCER_IDLE_GATE.artifactSha256 + ' but rendered ' + rawHash);
if (EN_E03_SUN_LANCER_IDLE_GATE.assembledArtifactSha256 && assembledHash !== EN_E03_SUN_LANCER_IDLE_GATE.assembledArtifactSha256) drift.push('Complete B + Form review expected ' + EN_E03_SUN_LANCER_IDLE_GATE.assembledArtifactSha256 + ' but rendered ' + assembledHash);
if (EN_E03_SUN_LANCER_IDLE_GATE.candidateFrameDigest && candidateFrameDigest !== EN_E03_SUN_LANCER_IDLE_GATE.candidateFrameDigest) drift.push('frame digest expected ' + EN_E03_SUN_LANCER_IDLE_GATE.candidateFrameDigest + ' but rendered ' + candidateFrameDigest);
if (drift.length) throw new Error('EN-E03 Sun Lancer Idle evidence drifted from the frozen candidate gate:\n- ' + drift.join('\n- '));

const report = {
  format: 'enemy-expansion-en-e03-sun-lancer-idle-v1',
  sliceId: 'EN-E03',
  state: EN_E03_SUN_LANCER_IDLE_GATE.status,
  artifact: 'en-e03-sun-lancer-idle-raw.png',
  png: { width: rawBoard.width, height: rawBoard.height, sha256: rawHash },
  assembledArtifact: 'en-e03-sun-lancer-idle-complete-b-form.png',
  assembledPng: { width: assembledBoard.width, height: assembledBoard.height, sha256: assembledHash },
  animationFrames: {
    raw: ['animation-frames/raw-1.png', 'animation-frames/raw-2.png'],
    completeBForm: ['animation-frames/complete-b-form-1.png', 'animation-frames/complete-b-form-2.png'],
    width: 192,
    height: 224,
    frameDurationMs: 240,
  },
  candidateFrameDigest,
  referenceFrameDigest,
  authorization: EN_E03_SUN_LANCER_IDLE_GATE,
  candidateFrames,
  referenceFrames,
  guarantees: {
    candidateFamilies: EN_E03_SUN_LANCER_IDLE_REGISTRY.families.length,
    candidateVariants: 1,
    candidateFrames: candidateFrames.length,
    approvedReferenceFrames: referenceFrames.length,
    publicCandidateFamilies: EN_E03_SUN_LANCER_IDLE_REGISTRY.publicFamilies.length,
    animationsRendered: ['idle'],
    frameIndicesRendered: [0, 1],
    directions,
    binaryAlpha: true,
    effectBoundary: 'external-charge-dust-spear-trail-and-hoof-shock-ring',
    effects: 'off',
    assembledPresentation: ['Complete B', 'Form'],
  },
};

await mkdir(animationOutput, { recursive: true });
await writeFile(path.join(output, report.artifact), rawBoard.png);
await writeFile(path.join(output, report.assembledArtifact), assembledBoard.png);
for (let frame = 0; frame < 2; frame++) {
  await writeFile(path.join(animationOutput, 'raw-' + (frame + 1) + '.png'), renderAnimationFrame(frame, false).png);
  await writeFile(path.join(animationOutput, 'complete-b-form-' + (frame + 1) + '.png'), renderAnimationFrame(frame, true).png);
}
await writeFile(path.join(output, 'en-e03-sun-lancer-idle-review.json'), JSON.stringify(report, null, 2) + '\n');

console.log('Generated the bounded EN-E03 Sun Lancer two-frame Idle evidence.');
console.log('- Raw PNG: ' + path.relative(root, path.join(output, report.artifact)) + ' (' + rawBoard.width + 'x' + rawBoard.height + ')');
console.log('- Raw PNG SHA-256: ' + rawHash);
console.log('- Complete B + Form PNG: ' + path.relative(root, path.join(output, report.assembledArtifact)) + ' (' + assembledBoard.width + 'x' + assembledBoard.height + ')');
console.log('- Complete B + Form PNG SHA-256: ' + assembledHash);
console.log('- Candidate frame digest: ' + candidateFrameDigest);
console.log('- Candidate scope: one specialist / two Idle frames / four directions / external effects');
