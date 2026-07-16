// Sprite-sheet assembly and thumbnail generation.

import { ANIMS, DIRS, SHEET_COLS, SIZE } from './catalogs.js';
import { drawSprite } from './renderer.js';

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
        drawSprite(tctx, spec, dir, anim.id, f, { shadow: opts.shadow === true });
        octx.drawImage(tmp, col * SIZE * scale, r * SIZE * scale, SIZE * scale, SIZE * scale);
        col++;
      }
    }
  });
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
