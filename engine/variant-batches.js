import {
  OFFHANDS,
  OUTFITS,
  OUTFIT_TIERS,
  SHIELDS,
  SHIELD_TIERS,
  WEAPONS,
  WEAPON_TIERS,
} from './catalogs.js';

export const VARIANT_BATCH_FORMAT = '8-bit-sprite-assembler-equipment-variant-batch';
export const VARIANT_BATCH_VERSION = 3;

export const VARIANT_BATCH_SETS = Object.freeze([
  {
    id: 'weapon-families',
    name: 'Weapon families',
    description: 'Unarmed plus every weapon family at the currently selected weapon tier.',
  },
  {
    id: 'current-weapon-tiers',
    name: 'Current weapon tiers',
    description: 'Tier 1 through Tier 5 for the currently equipped weapon.',
  },
  {
    id: 'weapon-arsenal',
    name: 'Complete weapon arsenal',
    description: 'Unarmed plus every weapon family at all five tiers.',
  },
  {
    id: 'armor-tiers',
    name: 'Armor progression',
    description: 'The current outfit from Tier 1 through Tier 5.',
  },
  {
    id: 'shield-armory',
    name: 'Complete shield armory',
    description: 'No shield plus every shield family at all five tiers.',
  },
  {
    id: 'offhand-items',
    name: 'Off-hand items',
    description: 'An empty utility slot plus every non-shield off-hand item.',
  },
  {
    id: 'rpg-equipment',
    name: 'RPG equipment collection',
    description: 'The complete weapon arsenal, armor progression, shield armory, and non-shield off-hand items in one deduplicated pack.',
  },
]);

export const DEFAULT_VARIANT_BATCH_SET = 'rpg-equipment';

function itemName(item, tierId) {
  if (!item || item.id === 'none' || tierId === 'tier1') return item?.name || 'None';
  const tierNumber = Number(String(tierId).replace('tier', ''));
  return item[`tier${tierNumber}Name`] || `${item.name} Tier ${tierNumber}`;
}

function copyPlayer(player, patch = {}) {
  const spec = {
    ...player,
    ...patch,
    palette: player.palette ? {
      skin: [...player.palette.skin],
      hair: [...player.palette.hair],
      outfit: [...player.palette.outfit],
    } : null,
  };
  if (spec.weapon === 'none') spec.weaponTier = 'tier1';
  if (spec.shield && spec.shield !== 'none') {
    spec.offhand = 'none';
  } else if (spec.offhand && spec.offhand !== 'none') {
    spec.shield = 'none';
    spec.shieldTier = 'tier1';
  } else {
    spec.offhand = 'none';
  }
  if (spec.shield === 'none') spec.shieldTier = 'tier1';
  return spec;
}

function addVariant(variants, bySpec, basePlayer, patch, entry) {
  const spec = copyPlayer(basePlayer, patch);
  const key = JSON.stringify(spec);
  const existing = bySpec.get(key);
  if (existing) {
    if (!existing.series.includes(entry.series)) existing.series.push(entry.series);
    return;
  }
  const variant = {
    id: entry.id,
    name: entry.name,
    series: [entry.series],
    spec,
  };
  variants.push(variant);
  bySpec.set(key, variant);
}

function addWeaponFamilies(variants, bySpec, player) {
  for (const weapon of WEAPONS) {
    const weaponTier = weapon.id === 'none' ? 'tier1' : player.weaponTier;
    addVariant(variants, bySpec, player, { weapon: weapon.id, weaponTier }, {
      id: `weapon-${weapon.id}-${weaponTier}`,
      name: itemName(weapon, weaponTier),
      series: 'weapon-families',
    });
  }
}

function addCurrentWeaponTiers(variants, bySpec, player) {
  const weapon = WEAPONS.find((item) => item.id === player.weapon) || WEAPONS[0];
  const tiers = weapon.id === 'none' ? WEAPON_TIERS.slice(0, 1) : WEAPON_TIERS;
  for (const tier of tiers) {
    addVariant(variants, bySpec, player, { weapon: weapon.id, weaponTier: tier.id }, {
      id: `weapon-${weapon.id}-${tier.id}`,
      name: itemName(weapon, tier.id),
      series: 'current-weapon-tiers',
    });
  }
}

function addWeaponArsenal(variants, bySpec, player) {
  for (const weapon of WEAPONS) {
    const tiers = weapon.id === 'none' ? WEAPON_TIERS.slice(0, 1) : WEAPON_TIERS;
    for (const tier of tiers) {
      addVariant(variants, bySpec, player, { weapon: weapon.id, weaponTier: tier.id }, {
        id: `weapon-${weapon.id}-${tier.id}`,
        name: itemName(weapon, tier.id),
        series: 'weapon-arsenal',
      });
    }
  }
}

function addArmorTiers(variants, bySpec, player) {
  const outfit = OUTFITS.find((item) => item.id === player.outfit) || OUTFITS[0];
  for (const tier of OUTFIT_TIERS) {
    addVariant(variants, bySpec, player, { outfitTier: tier.id }, {
      id: `armor-${outfit.id}-${tier.id}`,
      name: itemName(outfit, tier.id),
      series: 'armor-tiers',
    });
  }
}

function addShieldArmory(variants, bySpec, player) {
  for (const shield of SHIELDS) {
    const tiers = shield.id === 'none' ? SHIELD_TIERS.slice(0, 1) : SHIELD_TIERS;
    for (const tier of tiers) {
      addVariant(variants, bySpec, player, {
        shield: shield.id,
        shieldTier: tier.id,
        offhand: 'none',
      }, {
        id: `shield-${shield.id}-${tier.id}`,
        name: itemName(shield, tier.id),
        series: 'shield-armory',
      });
    }
  }
}

function addOffhandItems(variants, bySpec, player) {
  for (const offhand of OFFHANDS) {
    addVariant(variants, bySpec, player, {
      shield: 'none',
      shieldTier: 'tier1',
      offhand: offhand.id,
    }, {
      id: `offhand-${offhand.id}`,
      name: offhand.name,
      series: 'offhand-items',
    });
  }
}

export function buildVariantBatch(player, setId = DEFAULT_VARIANT_BATCH_SET) {
  const set = VARIANT_BATCH_SETS.find((item) => item.id === setId) || VARIANT_BATCH_SETS.at(-1);
  const variants = [];
  const bySpec = new Map();

  if (set.id === 'weapon-families') addWeaponFamilies(variants, bySpec, player);
  else if (set.id === 'current-weapon-tiers') addCurrentWeaponTiers(variants, bySpec, player);
  else if (set.id === 'weapon-arsenal') addWeaponArsenal(variants, bySpec, player);
  else if (set.id === 'armor-tiers') addArmorTiers(variants, bySpec, player);
  else if (set.id === 'shield-armory') addShieldArmory(variants, bySpec, player);
  else if (set.id === 'offhand-items') addOffhandItems(variants, bySpec, player);
  else {
    addWeaponArsenal(variants, bySpec, player);
    addArmorTiers(variants, bySpec, player);
    addShieldArmory(variants, bySpec, player);
    addOffhandItems(variants, bySpec, player);
  }

  return { set, variants };
}
