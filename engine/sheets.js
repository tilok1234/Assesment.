// Sprite-sheet assembly and thumbnail generation.

import { ANIMS, DIRS, SHEET_COLS, SIZE } from './catalogs.js';
import {
  drawOutlinedSprite,
  normalizeOutlineMode,
  OUTLINE_MODE_NONE,
} from './outline-renderer.js';
import { drawSprite } from './renderer.js';

function drawSheetFrame(context, spec, direction, animationId, frame, options) {
  if (normalizeOutlineMode(options.outlineMode) === OUTLINE_MODE_NONE) {
    drawSprite(context, spec, direction, animationId, frame, options);
    return;
  }
  drawOutlinedSprite(context, spec, direction, animationId, frame, options);
}

// ---------------- sheet builder ----------------
export function buildSheet(spec, scale = 1, opts = {}) {
  const out = document.createElement('canvas');
  out.width = SHEET_COLS * SIZE * scale;
  out.height = DIRS.length * SIZE * scale;
  const octx = out.getContext('2d');
  octx.imageSmoothingEnabled = false;

  const tmp = document.createElement('canvas');
  tmp.width = SIZE; tmp.height = SIZE;
  const tctx = tmp.getContext('2d');

  DIRS.forEach((dir, r) => {
    let col = 0;
    for (const anim of ANIMS) {
      for (let f = 0; f < anim.frames; f++) {
        drawSheetFrame(tctx, spec, dir, anim.id, f, { ...opts, shadow: opts.shadow === true });
        octx.drawImage(tmp, col * SIZE * scale, r * SIZE * scale, SIZE * scale, SIZE * scale);
        col++;
      }
    }
  });
  return out;
}

export function buildAnimationSheet(spec, animId, scale = 1, opts = {}) {
  const anim = ANIMS.find((item) => item.id === animId) || ANIMS[0];
  const out = document.createElement('canvas');
  out.width = anim.frames * SIZE * scale;
  out.height = DIRS.length * SIZE * scale;
  const octx = out.getContext('2d');
  octx.imageSmoothingEnabled = false;

  const tmp = document.createElement('canvas');
  tmp.width = SIZE; tmp.height = SIZE;
  const tctx = tmp.getContext('2d');
  DIRS.forEach((dir, row) => {
    for (let frame = 0; frame < anim.frames; frame++) {
      drawSheetFrame(tctx, spec, dir, anim.id, frame, { ...opts, shadow: opts.shadow === true });
      octx.drawImage(tmp, frame * SIZE * scale, row * SIZE * scale, SIZE * scale, SIZE * scale);
    }
  });
  return out;
}

export function buildDirectionSheet(spec, direction, scale = 1, opts = {}) {
  const dir = DIRS.includes(direction) ? direction : DIRS[0];
  const out = document.createElement('canvas');
  out.width = SHEET_COLS * SIZE * scale;
  out.height = SIZE * scale;
  const octx = out.getContext('2d');
  octx.imageSmoothingEnabled = false;

  const tmp = document.createElement('canvas');
  tmp.width = SIZE; tmp.height = SIZE;
  const tctx = tmp.getContext('2d');
  let column = 0;
  for (const anim of ANIMS) {
    for (let frame = 0; frame < anim.frames; frame++) {
      drawSheetFrame(tctx, spec, dir, anim.id, frame, { ...opts, shadow: opts.shadow === true });
      octx.drawImage(tmp, column * SIZE * scale, 0, SIZE * scale, SIZE * scale);
      column++;
    }
  }
  return out;
}

// ---------------- thumbnails ----------------
let _thumbCanvas = null;
export function thumbURL(spec, dir = 'down', animId = 'idle', f = 0) {
  if (!_thumbCanvas) {
    _thumbCanvas = document.createElement('canvas');
    _thumbCanvas.width = SIZE; _thumbCanvas.height = SIZE;
  }
  const ctx = _thumbCanvas.getContext('2d');
  drawSprite(ctx, spec, dir, animId, f, { shadow: false });
  return _thumbCanvas.toDataURL();
}
