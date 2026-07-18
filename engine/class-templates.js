import {
  OUTFITS,
  OUTFIT_TIERS,
  SHIELDS,
  SHIELD_TIERS,
  WEAPONS,
  WEAPON_TIERS,
} from './catalogs.js';

export const CLASS_PACK_FORMAT = '8-bit-sprite-assembler-class-pack';
export const CLASS_PACK_VERSION = 1;

export const CLASS_TEMPLATES = Object.freeze([
  Object.freeze({
    id: 'warrior',
    name: 'Warrior',
    description: 'Heavy frontline arsenal with blades, axes, hammers, spears, and four sturdy shield families.',
    outfit: 'plate',
    defaultWeapon: 'sword',
    defaultShield: 'round',
    weapons: Object.freeze(['sword', 'greatsword', 'axe', 'mace', 'warhammer', 'spear']),
    shields: Object.freeze(['round', 'kite', 'heater', 'tower']),
  }),
  Object.freeze({
    id: 'guardian',
    name: 'Guardian',
    description: 'Defensive plate specialist with practical weapons and the broadest physical shield selection.',
    outfit: 'plate',
    defaultWeapon: 'sword',
    defaultShield: 'tower',
    weapons: Object.freeze(['sword', 'mace', 'warhammer', 'spear']),
    shields: Object.freeze(['round', 'kite', 'heater', 'tower', 'oval', 'bone']),
  }),
  Object.freeze({
    id: 'ranger',
    name: 'Ranger',
    description: 'Leather-clad ranged hunter with bows, crossbows, field blades, spears, and an optional buckler.',
    outfit: 'leather',
    defaultWeapon: 'bow',
    defaultShield: 'none',
    weapons: Object.freeze(['dagger', 'spear', 'bow', 'crossbow']),
    shields: Object.freeze(['buckler']),
  }),
  Object.freeze({
    id: 'rogue',
    name: 'Rogue',
    description: 'Fast leather skirmisher with finesse blades, a compact crossbow, and an optional buckler.',
    outfit: 'leather',
    defaultWeapon: 'dagger',
    defaultShield: 'none',
    weapons: Object.freeze(['scimitar', 'rapier', 'dagger', 'crossbow']),
    shields: Object.freeze(['buckler']),
  }),
  Object.freeze({
    id: 'mage',
    name: 'Mage',
    description: 'Arcane robe progression with staff, wand, spellbook, and optional arcane shield variants.',
    outfit: 'robe',
    defaultWeapon: 'staff',
    defaultShield: 'none',
    weapons: Object.freeze(['staff', 'wand', 'spellbook']),
    shields: Object.freeze(['arcane']),
  }),
  Object.freeze({
    id: 'cleric',
    name: 'Cleric',
    description: 'Armored divine hybrid with blunt weapons, holy focuses, and physical or arcane shields.',
    outfit: 'plate',
    defaultWeapon: 'mace',
    defaultShield: 'round',
    weapons: Object.freeze(['mace', 'warhammer', 'staff', 'wand']),
    shields: Object.freeze(['round', 'heater', 'arcane']),
  }),
]);

export const DEFAULT_CLASS_TEMPLATE = 'warrior';

function templateById(templateId) {
  return CLASS_TEMPLATES.find((template) => template.id === templateId) || CLASS_TEMPLATES[0];
}

function catalogItem(catalog, id) {
  return catalog.find((item) => item.id === id) || catalog[0];
}

function itemName(item, tierId) {
  if (!item || item.id === 'none' || tierId === 'tier1') return item?.name || 'None';
  const tierNumber = Number(String(tierId).replace('tier', ''));
  return item[`tier${tierNumber}Name`] || `${item.name} Tier ${tierNumber}`;
}

function copyPalette(palette) {
  return palette ? {
    skin: [...palette.skin],
    hair: [...palette.hair],
    outfit: [...palette.outfit],
  } : null;
}

function copyPlayer(player, patch = {}) {
  const spec = { ...player, ...patch, palette: copyPalette(player.palette) };
  if (spec.weapon === 'none') spec.weaponTier = 'tier1';
  if (spec.shield === 'none') spec.shieldTier = 'tier1';
  return spec;
}

function addVariant(variants, bySpec, baseSpec, patch, entry) {
  const spec = copyPlayer(baseSpec, patch);
  const key = JSON.stringify(spec);
  const existing = bySpec.get(key);
  if (existing) {
    if (!existing.series.includes(entry.series)) existing.series.push(entry.series);
    return;
  }
  const variant = { ...entry, series: [entry.series], spec };
  variants.push(variant);
  bySpec.set(key, variant);
}

export function applyClassTemplate(player, templateId = DEFAULT_CLASS_TEMPLATE) {
  const template = templateById(templateId);
  return copyPlayer(player, {
    outfit: template.outfit,
    outfitTier: 'tier1',
    weapon: template.defaultWeapon,
    weaponTier: 'tier1',
    shield: template.defaultShield,
    shieldTier: 'tier1',
  });
}

export function buildClassPack(player, templateId = DEFAULT_CLASS_TEMPLATE) {
  const template = templateById(templateId);
  const baseSpec = applyClassTemplate(player, template.id);
  const variants = [];
  const bySpec = new Map();

  for (const weaponId of template.weapons) {
    const weapon = catalogItem(WEAPONS, weaponId);
    for (const tier of WEAPON_TIERS) {
      addVariant(variants, bySpec, baseSpec, { weapon: weapon.id, weaponTier: tier.id }, {
        id: `weapon-${weapon.id}-${tier.id}`,
        name: itemName(weapon, tier.id),
        series: 'class-weapons',
      });
    }
  }

  const outfit = catalogItem(OUTFITS, template.outfit);
  for (const tier of OUTFIT_TIERS) {
    addVariant(variants, bySpec, baseSpec, { outfitTier: tier.id }, {
      id: `armor-${outfit.id}-${tier.id}`,
      name: itemName(outfit, tier.id),
      series: 'class-armor',
    });
  }

  const shieldIds = ['none', ...template.shields];
  for (const shieldId of shieldIds) {
    const shield = catalogItem(SHIELDS, shieldId);
    const tiers = shield.id === 'none' ? SHIELD_TIERS.slice(0, 1) : SHIELD_TIERS;
    for (const tier of tiers) {
      addVariant(variants, bySpec, baseSpec, { shield: shield.id, shieldTier: tier.id }, {
        id: `shield-${shield.id}-${tier.id}`,
        name: itemName(shield, tier.id),
        series: 'class-shields',
      });
    }
  }

  return { template, baseSpec, variants };
}
