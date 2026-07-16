// Public Sprite Assembler engine API.
// Keep consumers importing this file while implementation modules evolve independently.

export {
  ANIMS,
  DIRS,
  DIR_LABELS,
  ENEMIES,
  FACIAL_DETAILS,
  HAIR_COLORS,
  HAIR_STYLES,
  HEADGEAR,
  OUTFITS,
  OUTFIT_COLORS,
  SHEET_COLS,
  SHIELDS,
  SIZE,
  SKINS,
  WEAPONS,
} from './engine/catalogs.js';
export { drawSprite } from './engine/renderer.js';
export { buildAnimationSheet, buildDirectionSheet, buildSheet, thumbURL } from './engine/sheets.js';
export { describe, randomEnemy, randomPlayer } from './engine/generators.js';
