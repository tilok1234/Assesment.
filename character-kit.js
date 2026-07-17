import {
  HAIR_COLORS,
  HEADGEAR,
  OUTFITS,
  OUTFIT_COLORS,
  SHIELDS,
  SHIELD_TIERS,
  SKINS,
  WEAPONS,
  WEAPON_TIERS,
} from './sprite-engine.js';

export const MASTER_CHARACTER_KIT_FORMAT = '8-bit-sprite-assembler-master-character-kit';
export const MASTER_CHARACTER_KIT_VERSION = 1;
export const MASTER_CHARACTER_KIT_SCALE = 1;
export const MASTER_CHARACTER_KIT_LAYER_ORDER = [
  'weapon-back',
  'shield-back',
  'body',
  'shield-front',
  'weapon-front',
];

const clonePair = (pair) => Array.isArray(pair) ? pair.slice(0, 2) : null;
const samePair = (left, right) => (
  Array.isArray(left)
  && Array.isArray(right)
  && left[0]?.toLocaleLowerCase() === right[0]?.toLocaleLowerCase()
  && left[1]?.toLocaleLowerCase() === right[1]?.toLocaleLowerCase()
);

function clonePalette(palette) {
  if (!palette) return null;
  return {
    skin: clonePair(palette.skin),
    hair: clonePair(palette.hair),
    outfit: clonePair(palette.outfit),
  };
}

function clonePlayer(player) {
  return { kind: 'player', ...player, palette: clonePalette(player.palette) };
}

function outfitColorChoices(player) {
  const choices = OUTFIT_COLORS.map((color) => ({
    id: color.id,
    name: color.name,
    catalogId: color.id,
    colors: clonePair(color.c),
    custom: false,
  }));
  const custom = player.palette?.outfit;
  if (custom && !OUTFIT_COLORS.some((color) => samePair(color.c, custom))) {
    choices.push({
      id: 'custom',
      name: 'Custom',
      catalogId: player.outfitColor,
      colors: clonePair(custom),
      custom: true,
    });
  }
  return choices;
}

function paletteForColor(player, color) {
  if (!player.palette) return null;
  return {
    skin: clonePair(player.palette.skin),
    hair: clonePair(player.palette.hair),
    outfit: clonePair(color.colors),
  };
}

function tieredName(item, tier) {
  if (tier.id === 'tier1') return item.name;
  return item[`${tier.id}Name`] || `${item.name} ${tier.name}`;
}

export function masterCharacterKitCounts(player) {
  const outfitColors = outfitColorChoices(player).length;
  const bodySheets = OUTFITS.length * HEADGEAR.length * outfitColors;
  const weaponVariants = (WEAPONS.length - 1) * WEAPON_TIERS.length;
  const shieldVariants = (SHIELDS.length - 1) * SHIELD_TIERS.length * outfitColors;
  const weaponLayers = weaponVariants * 2;
  const shieldLayers = shieldVariants * 2;
  return {
    outfitColors,
    bodySheets,
    weaponVariants,
    weaponLayers,
    shieldVariants,
    shieldLayers,
    assembledPreviews: 1,
    totalPngs: bodySheets + weaponLayers + shieldLayers + 1,
  };
}

export function buildMasterCharacterKitPlan(player) {
  const base = clonePlayer(player);
  const colors = outfitColorChoices(base);
  const bodies = [];
  const weapons = [];
  const shields = [];

  for (const outfit of OUTFITS) {
    for (const color of colors) {
      for (const headgear of HEADGEAR) {
        const spec = {
          ...clonePlayer(base),
          outfit: outfit.id,
          outfitColor: color.catalogId,
          headgear: headgear.id,
          weapon: 'none',
          weaponTier: 'tier1',
          shield: 'none',
          shieldTier: 'tier1',
          palette: paletteForColor(base, color),
        };
        bodies.push({
          outfit: outfit.id,
          outfitName: outfit.name,
          outfitColor: color.id,
          outfitColorName: color.name,
          colors: clonePair(color.colors),
          headgear: headgear.id,
          headgearName: headgear.name,
          file: `bodies/${outfit.id}/${color.id}/${headgear.id}.png`,
          layer: 'body',
          spec,
        });
      }
    }
  }

  for (const weapon of WEAPONS.filter((item) => item.id !== 'none')) {
    for (const tier of WEAPON_TIERS) {
      weapons.push({
        weapon: weapon.id,
        weaponName: tieredName(weapon, tier),
        tier: tier.id,
        tierName: tier.name,
        files: {
          back: `weapons/${weapon.id}/${tier.id}/back.png`,
          front: `weapons/${weapon.id}/${tier.id}/front.png`,
        },
        spec: {
          ...clonePlayer(base),
          weapon: weapon.id,
          weaponTier: tier.id,
          shield: 'none',
          shieldTier: 'tier1',
        },
      });
    }
  }

  for (const shield of SHIELDS.filter((item) => item.id !== 'none')) {
    for (const tier of SHIELD_TIERS) {
      for (const color of colors) {
        shields.push({
          shield: shield.id,
          shieldName: tieredName(shield, tier),
          tier: tier.id,
          tierName: tier.name,
          color: color.id,
          colorName: color.name,
          colors: clonePair(color.colors),
          files: {
            back: `shields/${shield.id}/${tier.id}/${color.id}/back.png`,
            front: `shields/${shield.id}/${tier.id}/${color.id}/front.png`,
          },
          spec: {
            ...clonePlayer(base),
            outfitColor: color.catalogId,
            weapon: 'none',
            weaponTier: 'tier1',
            shield: shield.id,
            shieldTier: tier.id,
            palette: paletteForColor(base, color),
          },
        });
      }
    }
  }

  return {
    identity: {
      skin: base.skin,
      skinName: SKINS.find((item) => item.id === base.skin)?.name || base.skin,
      hairStyle: base.hairStyle,
      hairColor: base.hairColor,
      hairColorName: HAIR_COLORS.find((item) => item.id === base.hairColor)?.name || base.hairColor,
      faceDetail: base.faceDetail,
      customSkinColors: clonePair(base.palette?.skin),
      customHairColors: clonePair(base.palette?.hair),
    },
    sourcePlayer: base,
    colors: colors.map(({ catalogId, ...color }) => ({ ...color, colors: clonePair(color.colors) })),
    bodies,
    weapons,
    shields,
    counts: masterCharacterKitCounts(base),
  };
}
