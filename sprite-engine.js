// Public Sprite Assembler engine API.
// Keep consumers importing this file while implementation modules evolve independently.
export {
  ANIMS,
  BODY_BUILDS,
  COMBAT_EFFECTS,
  DIRS,
  DIR_LABELS,
  ENEMIES,
  EXPRESSIONS,
  FACIAL_DETAILS,
  HAIR_COLORS,
  HAIR_STYLES,
  HEADGEAR,
  OFFHANDS,
  OUTFITS,
  OUTFIT_COLORS,
  OUTFIT_TIERS,
  SHEET_COLS,
  SHIELDS,
  SHIELD_TIERS,
  SIZE,
  SKINS,
  SPECIES,
  WEAPONS,
  WEAPON_TIERS,
} from './engine/catalogs.js';
export { drawSprite } from './engine/renderer.js';
export { drawOutlinedSprite, enemySupportsOutline, ENEMY_OUTLINE_PILOT_FAMILIES, normalizeAssembledOutlineMode, normalizeOutlineMode, OUTLINE_COLOR, OUTLINE_LAYER_ORDER, OUTLINE_MODE_COMPLETE_B, OUTLINE_MODE_NONE, OUTLINE_MODE_SELECTIVE_C, OUTLINE_MODES } from './engine/outline-renderer.js';
export { drawAssembledSprite, normalizeShadeMode, SHADE_MODE_FORM, SHADE_MODE_NONE, SHADE_MODES } from './engine/shade-renderer.js';
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
export {
  buildVariantBatch,
  DEFAULT_VARIANT_BATCH_SET,
  VARIANT_BATCH_FORMAT,
  VARIANT_BATCH_SETS,
  VARIANT_BATCH_VERSION,
} from './engine/variant-batches.js';
export {
  applyClassTemplate,
  buildClassPack,
  CLASS_PACK_FORMAT,
  CLASS_PACK_VERSION,
  CLASS_TEMPLATES,
  DEFAULT_CLASS_TEMPLATE,
} from './engine/class-templates.js';
export { auditProductionRollCatalogs, auditProductionRollClassTemplates, normalizeProductionRollSeed, PRODUCTION_PALETTE_FAMILIES, PRODUCTION_ROLL_FREEZE, PRODUCTION_ROLL_MAX_ATTEMPTS, PRODUCTION_ROLL_PROFILE, PRODUCTION_ROLL_REASON_CODES, rollProductionPlayer, validateProductionPlayer } from './engine/production-rolls.js';
