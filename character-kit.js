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

export const MASTER_ROSTER_KIT_FORMAT = '8-bit-sprite-assembler-master-roster-kit';
export const MASTER_ROSTER_KIT_VERSION = 1;
export const MASTER_ROSTER_KIT_LIMIT = 24;

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
  return { ...player, kind: 'player', palette: clonePalette(player.palette) };
}

function catalogOutfitColorChoices() {
  return OUTFIT_COLORS.map((color) => ({
    id: color.id,
    name: color.name,
    catalogId: color.id,
    colors: clonePair(color.c),
    custom: false,
  }));
}

function outfitColorChoices(player) {
  const choices = catalogOutfitColorChoices();
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

function colorPathId(pair) {
  const value = pair
    .map((color) => String(color || '').replace(/[^a-f0-9]/gi, '').toLocaleLowerCase() || 'color')
    .join('-');
  return `custom-${value}`;
}

function rosterColorChoices(entries) {
  const choices = catalogOutfitColorChoices();
  const seen = choices.map((choice) => choice.colors);
  for (const entry of entries) {
    const custom = entry.player.palette?.outfit;
    if (!custom || seen.some((pair) => samePair(pair, custom))) continue;
    const colors = clonePair(custom);
    choices.push({
      id: colorPathId(colors),
      name: `${entry.name} Custom`,
      catalogId: entry.player.outfitColor,
      colors,
      custom: true,
    });
    seen.push(colors);
  }
  return choices;
}

function paletteForColor(player, color) {
  if (!player.palette && !color.custom) return null;
  return {
    skin: clonePair(player.palette?.skin),
    hair: clonePair(player.palette?.hair),
    outfit: clonePair(color.colors),
  };
}

function tieredName(item, tier) {
  if (tier.id === 'tier1') return item.name;
  return item[`${tier.id}Name`] || `${item.name} ${tier.name}`;
}

function identityFor(player) {
  return {
    skin: player.skin,
    skinName: SKINS.find((item) => item.id === player.skin)?.name || player.skin,
    hairStyle: player.hairStyle,
    hairColor: player.hairColor,
    hairColorName: HAIR_COLORS.find((item) => item.id === player.hairColor)?.name || player.hairColor,
    faceDetail: player.faceDetail,
    customSkinColors: clonePair(player.palette?.skin),
    customHairColors: clonePair(player.palette?.hair),
  };
}

function manifestColors(colors) {
  return colors.map(({ catalogId, ...color }) => ({ ...color, colors: clonePair(color.colors) }));
}

function buildBodies(base, colors, root = 'bodies') {
  const bodies = [];
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
          file: `${root}/${outfit.id}/${color.id}/${headgear.id}.png`,
          layer: 'body',
          spec,
        });
      }
    }
  }
  return bodies;
}

function buildWeapons(base, root = 'weapons') {
  const weapons = [];
  for (const weapon of WEAPONS.filter((item) => item.id !== 'none')) {
    for (const tier of WEAPON_TIERS) {
      weapons.push({
        weapon: weapon.id,
        weaponName: tieredName(weapon, tier),
        tier: tier.id,
        tierName: tier.name,
        files: {
          back: `${root}/${weapon.id}/${tier.id}/back.png`,
          front: `${root}/${weapon.id}/${tier.id}/front.png`,
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
  return weapons;
}

function buildShields(base, colors, root = 'shields') {
  const shields = [];
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
            back: `${root}/${shield.id}/${tier.id}/${color.id}/back.png`,
            front: `${root}/${shield.id}/${tier.id}/${color.id}/front.png`,
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
  return shields;
}

function countsFor(characterCount, outfitColors) {
  const bodySheets = characterCount * OUTFITS.length * HEADGEAR.length * outfitColors;
  const weaponVariants = (WEAPONS.length - 1) * WEAPON_TIERS.length;
  const shieldVariants = (SHIELDS.length - 1) * SHIELD_TIERS.length * outfitColors;
  const weaponLayers = weaponVariants * 2;
  const shieldLayers = shieldVariants * 2;
  const assembledPreviews = characterCount;
  return {
    characterCount,
    outfitColors,
    bodySheets,
    weaponVariants,
    weaponLayers,
    shieldVariants,
    shieldLayers,
    assembledPreviews,
    totalPngs: bodySheets + weaponLayers + shieldLayers + assembledPreviews,
  };
}

function normalizeRosterEntries(rawEntries) {
  if (!Array.isArray(rawEntries)) return [];
  return rawEntries.flatMap((raw, index) => {
    if (!raw || typeof raw !== 'object' || (raw.kind && raw.kind !== 'player')) return [];
    const player = raw.spec || raw.player || raw;
    if (!player || typeof player !== 'object') return [];
    const name = typeof raw.name === 'string' && raw.name.trim()
      ? raw.name.trim()
      : `Character ${index + 1}`;
    return [{
      sourceId: typeof raw.id === 'string' ? raw.id : null,
      name,
      player: clonePlayer(player),
    }];
  });
}

function pathSegment(value, fallback) {
  return String(value || fallback)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || fallback;
}

function uniqueCharacterId(name, index, used) {
  const base = pathSegment(name, `character-${index + 1}`);
  let id = base;
  let suffix = 2;
  while (used.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  used.add(id);
  return id;
}

export function masterCharacterKitCounts(player) {
  return countsFor(1, outfitColorChoices(player).length);
}

export function buildMasterCharacterKitPlan(player) {
  const base = clonePlayer(player);
  const colors = outfitColorChoices(base);
  return {
    identity: identityFor(base),
    sourcePlayer: base,
    colors: manifestColors(colors),
    bodies: buildBodies(base, colors),
    weapons: buildWeapons(base),
    shields: buildShields(base, colors),
    counts: masterCharacterKitCounts(base),
  };
}

export function masterRosterKitCounts(rawEntries) {
  const entries = normalizeRosterEntries(rawEntries);
  const colors = rosterColorChoices(entries);
  return countsFor(entries.length, colors.length);
}

export function buildMasterRosterKitPlan(rawEntries) {
  const entries = normalizeRosterEntries(rawEntries);
  if (!entries.length) throw new Error('A master roster kit needs at least one player character.');
  if (entries.length > MASTER_ROSTER_KIT_LIMIT) {
    throw new RangeError(`A master roster kit supports up to ${MASTER_ROSTER_KIT_LIMIT} player characters.`);
  }

  const colors = rosterColorChoices(entries);
  const sharedBase = entries[0].player;
  const usedIds = new Set();
  const characters = entries.map((entry, index) => {
    const id = uniqueCharacterId(entry.name, index, usedIds);
    return {
      id,
      sourceId: entry.sourceId,
      name: entry.name,
      identity: identityFor(entry.player),
      sourcePlayer: clonePlayer(entry.player),
      defaultPreview: `characters/${id}/preview/default.png`,
      bodyRoot: `characters/${id}/bodies`,
      bodies: buildBodies(entry.player, colors, `characters/${id}/bodies`),
    };
  });
  const weapons = buildWeapons(sharedBase, 'shared/weapons');
  const shields = buildShields(sharedBase, colors, 'shared/shields');

  return {
    colors: manifestColors(colors),
    characters,
    weapons,
    shields,
    counts: {
      ...countsFor(characters.length, colors.length),
      bodySheets: characters.reduce((total, character) => total + character.bodies.length, 0),
      weaponVariants: weapons.length,
      weaponLayers: weapons.length * 2,
      shieldVariants: shields.length,
      shieldLayers: shields.length * 2,
      totalPngs: characters.reduce((total, character) => total + character.bodies.length, 0)
        + (weapons.length * 2)
        + (shields.length * 2)
        + characters.length,
    },
  };
}
