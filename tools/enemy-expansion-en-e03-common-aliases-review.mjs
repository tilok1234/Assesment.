import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ENEMY_EXPANSION_PROFILE } from '../engine/enemy-expansion.js';
import {
  EN_E03_COMMON_ALIAS_GATE,
  EN_E03_COMMON_ALIAS_REGISTRY,
} from '../engine/enemy-expansion-en-e03-common-aliases.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e03-common-aliases');
const animationOutput = path.join(output, 'animation-frames');

const FONT = Object.freeze({
  ' ': [0, 0, 0, 0, 0, 0, 0], '+': [0, 4, 4, 31, 4, 4, 0], '-': [0, 0, 0, 31, 0, 0, 0], '/': [1, 2, 2, 4, 8, 8, 16],
  '0': [14, 17, 19, 21, 25, 17, 14], '1': [4, 12, 4, 4, 4, 4, 14], '2': [14, 17, 1, 2, 4, 8, 31], '3': [30, 1, 1, 14, 1, 1, 30], '4': [2, 6, 10, 18, 31, 2, 2],
  A: [14, 17, 17, 31, 17, 17, 17], B: [30, 17, 17, 30, 17, 17, 30], C: [15, 16, 16, 16, 16, 16, 15], D: [30, 17, 17, 17, 17, 17, 30], E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16], G: [15, 16, 16, 19, 17, 17, 15], H: [17, 17, 17, 31, 17, 17, 17], I: [31, 4, 4, 4, 4, 4, 31], J: [7, 2, 2, 2, 18, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17], L: [16, 16, 16, 16, 16, 16, 31], M: [17, 27, 21, 21, 17, 17, 17], N: [17, 25, 21, 19, 17, 17, 17], O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16], Q: [14, 17, 17, 17, 21, 18, 13], R: [30, 17, 17, 30, 20, 18, 17], S: [15, 16, 16, 14, 1, 1, 30], T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 17, 21, 27, 17], X: [17, 17, 10, 4, 10, 17, 17], Y: [17, 17, 10, 4, 4, 4, 4], Z: [31, 1, 2, 4, 8, 16, 31],
});

const COLORS = Object.freeze({
  background: '#0b0f16', panel: '#141a24', panelAlt: '#111721', border: '#344052',
  title: '#f4cf66', cast: '#8fdcff', death: '#ff9aa9', approved: '#8ee39a',
  text: '#edf5ff', muted: '#9aa8b8', checkerA: '#202a37', checkerB: '#293646',
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
    const rgba = hexToRgba(fill);
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) this.rgba.set(rgba, ((py * this.width) + px) * 4);
  }

  textWidth(value, scale) { return Math.max(0, (value.length * 6 * scale) - scale); }

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
    if (border) this.fillRect(x - 1, y - 1, (size * scale) + 2, (size * scale) + 2, COLORS.border);
    for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
      const fill = pixels[(py * size) + px] || ((px + py) % 2 === 0 ? COLORS.checkerA : COLORS.checkerB);
      this.fillRect(x + (px * scale), y + (py * scale), scale, scale, fill);
    }
  }
}

const families = Object.freeze([
  { family: 'giant', variant: 'hill-breaker', label: 'HILL BREAKER' },
  { family: 'centaur', variant: 'steppe-hunter', label: 'STEPPE HUNTER' },
  { family: 'satyr', variant: 'briar-reveler', label: 'BRIAR REVELER' },
].map((entry) => {
  const family = EN_E03_COMMON_ALIAS_REGISTRY.families.find((value) => value.id === entry.family);
  const variant = family?.variants.find((value) => value.id === entry.variant);
  if (!variant) throw new TypeError('Missing alias review family ' + entry.family + '/' + entry.variant + '.');
  return Object.freeze({ ...entry, rendererData: variant.rendererData });
}));

const directions = ENEMY_EXPANSION_PROFILE.frameContract.directions;
const animations = ['cast', 'death'];
const captures = new Map();
const candidateFrames = [];

function frameRecord(captured, family, direction, animation, frame) {
  return {
    family: family.family, variant: family.variant, direction, animation, frame,
    digest: captured.digest, alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels, bounds: captured.bounds,
  };
}

for (const family of families) for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < 4; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E03_COMMON_ALIAS_REGISTRY,
    { kind: 'enemy', family: family.family, variant: family.variant },
    direction,
    animation,
    frame,
  );
  captures.set([family.family, animation, direction, frame].join('/'), captured);
  candidateFrames.push(frameRecord(captured, family, direction, animation, frame));
}

function pixelsFor(family, animation, direction, frame, assembled) {
  const captured = captures.get([family.family, animation, direction, frame].join('/'));
  return assembled ? buildEnemyExpansionCandidatePresentation(captured.pixels, family.rendererData).formComplete : captured.pixels;
}

function renderBoard(assembled) {
  const margin = 24;
  const labelWidth = 220;
  const scale = 2;
  const frameSize = 24 * scale;
  const frameGap = 4;
  const groupWidth = (frameSize * 4) + (frameGap * 3);
  const directionGap = 12;
  const headerHeight = 112;
  const rowHeight = 68;
  const footerHeight = 42;
  const rows = families.flatMap((family) => animations.map((animation) => ({ family, animation })));
  const width = (margin * 2) + labelWidth + (groupWidth * directions.length) + (directionGap * (directions.length - 1));
  const height = headerHeight + (rowHeight * rows.length) + footerHeight;
  const canvas = new PixelCanvas(width, height);
  const groupX = (index) => margin + labelWidth + (index * (groupWidth + directionGap));
  canvas.fillRect(0, 0, width, height, COLORS.background);
  canvas.fillRect(0, 0, width, headerHeight - 8, COLORS.panel);
  canvas.drawText(assembled ? 'EN-E03 COMPLETE B + FORM ALIASES' : 'EN-E03 COMMON CAST DEATH ALIASES', margin, 16, 3, COLORS.title);
  canvas.drawText('CAST EQUALS ATTACK   DEATH EQUALS H1 H2 H2 H2', margin, 52, 2, COLORS.muted);
  for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
    const x = groupX(directionIndex);
    canvas.drawCenteredText(directions[directionIndex], x + (groupWidth / 2), 78, 2, COLORS.cast);
    for (let frame = 0; frame < 4; frame++) canvas.drawCenteredText(String(frame + 1), x + (frame * (frameSize + frameGap)) + (frameSize / 2), 99, 1, COLORS.muted);
  }
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const { family, animation } = rows[rowIndex];
    const rowTop = headerHeight + (rowIndex * rowHeight);
    const accent = animation === 'cast' ? COLORS.cast : COLORS.death;
    canvas.fillRect(margin, rowTop + 4, width - (margin * 2), rowHeight - 8, rowIndex % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
    canvas.fillRect(margin, rowTop + 4, 5, rowHeight - 8, accent);
    canvas.drawText(family.label, margin + 16, rowTop + 13, 2, COLORS.text);
    canvas.drawText(animation + ' ALIAS', margin + 16, rowTop + 41, 1, accent);
    for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
      const x = groupX(directionIndex);
      for (let frame = 0; frame < 4; frame++) canvas.drawPixels(pixelsFor(family, animation, directions[directionIndex], frame, assembled), x + (frame * (frameSize + frameGap)), rowTop + 10, scale);
    }
  }
  const footerTop = headerHeight + (rowHeight * rows.length);
  canvas.fillRect(0, footerTop, width, footerHeight, COLORS.panel);
  canvas.drawText('NO NEW PIXELS   INTERNAL   ZERO PUBLIC FAMILIES', margin, footerTop + 13, 2, COLORS.approved);
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

function renderAnimationFrame(animation, frame, assembled) {
  const width = 576;
  const height = 224;
  const segmentWidth = 192;
  const panelWidth = 96;
  const panelHeight = 96;
  const canvas = new PixelCanvas(width, height);
  canvas.fillRect(0, 0, width, height, COLORS.background);
  for (let familyIndex = 0; familyIndex < families.length; familyIndex++) {
    const family = families[familyIndex];
    const segmentX = familyIndex * segmentWidth;
    const accent = animation === 'cast' ? COLORS.cast : COLORS.death;
    canvas.fillRect(segmentX, 0, segmentWidth, 32, COLORS.panel);
    if (segmentX > 0) canvas.fillRect(segmentX, 0, 1, height, COLORS.border);
    canvas.drawCenteredText(family.label + ' ' + animation, segmentX + 96, 4, 1, COLORS.title);
    canvas.drawCenteredText(animation[0] + String(frame + 1) + (assembled ? ' COMPLETE B + FORM' : ' RAW'), segmentX + 96, 17, 1, assembled ? COLORS.approved : accent);
    const positions = [[0, 32], [96, 32], [0, 128], [96, 128]];
    for (let directionIndex = 0; directionIndex < directions.length; directionIndex++) {
      const [localX, panelY] = positions[directionIndex];
      const panelX = segmentX + localX;
      canvas.fillRect(panelX, panelY, panelWidth, panelHeight, directionIndex % 2 === 0 ? COLORS.panel : COLORS.panelAlt);
      if (localX > 0) canvas.fillRect(panelX, panelY, 1, panelHeight, COLORS.border);
      if (panelY > 32) canvas.fillRect(panelX, panelY, panelWidth, 1, COLORS.border);
      canvas.drawCenteredText(directions[directionIndex], panelX + 48, panelY + 5, 2, COLORS.text);
      canvas.drawPixels(pixelsFor(family, animation, directions[directionIndex], frame, assembled), panelX + 12, panelY + 20, 3, false);
    }
  }
  return { png: encodeRgbaPng(width, height, canvas.rgba), width, height };
}

const rawBoard = renderBoard(false);
const assembledBoard = renderBoard(true);
const rawHash = createHash('sha256').update(rawBoard.png).digest('hex');
const assembledHash = createHash('sha256').update(assembledBoard.png).digest('hex');
const candidateFrameDigest = createHash('sha256').update(JSON.stringify(candidateFrames)).digest('hex');
const drift = [];
if (EN_E03_COMMON_ALIAS_GATE.artifactSha256 && rawHash !== EN_E03_COMMON_ALIAS_GATE.artifactSha256) drift.push('raw review expected ' + EN_E03_COMMON_ALIAS_GATE.artifactSha256 + ' but rendered ' + rawHash);
if (EN_E03_COMMON_ALIAS_GATE.assembledArtifactSha256 && assembledHash !== EN_E03_COMMON_ALIAS_GATE.assembledArtifactSha256) drift.push('Complete B + Form review expected ' + EN_E03_COMMON_ALIAS_GATE.assembledArtifactSha256 + ' but rendered ' + assembledHash);
if (EN_E03_COMMON_ALIAS_GATE.candidateFrameDigest && candidateFrameDigest !== EN_E03_COMMON_ALIAS_GATE.candidateFrameDigest) drift.push('frame digest expected ' + EN_E03_COMMON_ALIAS_GATE.candidateFrameDigest + ' but rendered ' + candidateFrameDigest);
if (drift.length) throw new Error('EN-E03 common alias evidence drifted from the frozen candidate gate:\n- ' + drift.join('\n- '));

const report = {
  format: 'enemy-expansion-en-e03-common-aliases-v1', sliceId: 'EN-E03', state: EN_E03_COMMON_ALIAS_GATE.status,
  artifact: 'en-e03-common-cast-death-aliases-raw.png', png: { width: rawBoard.width, height: rawBoard.height, sha256: rawHash },
  assembledArtifact: 'en-e03-common-cast-death-aliases-complete-b-form.png', assembledPng: { width: assembledBoard.width, height: assembledBoard.height, sha256: assembledHash },
  animationFrames: { width: 576, height: 224, frameDurationMs: 120, animations, framesPerAnimation: 4 },
  candidateFrameDigest, approval: EN_E03_COMMON_ALIAS_GATE, candidateFrames,
  guarantees: {
    candidateFamilies: families.length, candidateVariants: families.length, candidateFrames: candidateFrames.length,
    publicCandidateFamilies: EN_E03_COMMON_ALIAS_REGISTRY.publicFamilies.length,
    aliasContract: { cast: ['attack:0', 'attack:1', 'attack:2', 'attack:3'], death: ['hurt:0', 'hurt:1', 'hurt:1', 'hurt:1'] },
    directions, binaryAlpha: true, effects: 'off', newSpritePixels: 0, assembledPresentation: ['Complete B', 'Form'],
  },
};

await mkdir(animationOutput, { recursive: true });
await writeFile(path.join(output, report.artifact), rawBoard.png);
await writeFile(path.join(output, report.assembledArtifact), assembledBoard.png);
for (const animation of animations) for (let frame = 0; frame < 4; frame++) {
  await writeFile(path.join(animationOutput, animation + '-raw-' + (frame + 1) + '.png'), renderAnimationFrame(animation, frame, false).png);
  await writeFile(path.join(animationOutput, animation + '-complete-b-form-' + (frame + 1) + '.png'), renderAnimationFrame(animation, frame, true).png);
}
await writeFile(path.join(output, 'en-e03-common-cast-death-aliases-review.json'), JSON.stringify(report, null, 2) + '\n');

console.log('Generated the bounded EN-E03 common Cast/Death alias evidence.');
console.log('- Raw PNG: ' + path.relative(root, path.join(output, report.artifact)) + ' (' + rawBoard.width + 'x' + rawBoard.height + ')');
console.log('- Raw PNG SHA-256: ' + rawHash);
console.log('- Complete B + Form PNG: ' + path.relative(root, path.join(output, report.assembledArtifact)) + ' (' + assembledBoard.width + 'x' + assembledBoard.height + ')');
console.log('- Complete B + Form PNG SHA-256: ' + assembledHash);
console.log('- Candidate frame digest: ' + candidateFrameDigest);
console.log('- Animation PNGs: 16 at 576x224');
