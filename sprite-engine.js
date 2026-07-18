// Public Sprite Assembler engine API.
// Keep consumers importing this file while implementation modules evolve independently.

export {
  ANIMS,
  COMBAT_EFFECTS,
  DIRS,
  DIR_LABELS,
  ENEMIES,
  FACIAL_DETAILS,
  HAIR_COLORS,
  HAIR_STYLES,
  HEADGEAR,
  OUTFITS,
  OUTFIT_COLORS,
  OUTFIT_TIERS,
  SHEET_COLS,
  SHIELDS,
  SHIELD_TIERS,
  SIZE,
  SKINS,
  WEAPONS,
  WEAPON_TIERS,
} from './engine/catalogs.js';
export { drawSprite } from './engine/renderer.js';
export { buildAnimationSheet, buildDirectionSheet, buildSheet, thumbURL } from './engine/sheets.js';
export { describe, randomEffect, randomEnemy, randomPlayer } from './engine/generators.js';
export {
  combatLoadoutEffectSpecs,
  COMBAT_LOADOUT_FORMAT,
  COMBAT_LOADOUT_SLOTS,
  COMBAT_LOADOUT_VERSION,
  DEFAULT_COMBAT_LOADOUT,
  defaultCombatLoadout,
  resolveCombatLoadout,
  sanitizeCombatLoadout,
} from './engine/combat-loadouts.js';
