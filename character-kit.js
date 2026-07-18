import {
  BODY_BUILDS,
  COMBAT_EFFECTS,
  ENEMIES,
  EXPRESSIONS,
  FACIAL_DETAILS,
  HAIR_COLORS,
  HAIR_STYLES,
  HEADGEAR,
  OUTFITS,
  OUTFIT_COLORS,
  OUTFIT_TIERS,
  SHIELDS,
  SHIELD_TIERS,
  SKINS,
  SPECIES,
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

export const COMPLETE_CHARACTER_KIT_FORMAT = '8-bit-sprite-assembler-complete-character-kit';
export const COMPLETE_CHARACTER_KIT_VERSION = 8;
export const COMPLETE_CHARACTER_KIT_RECIPE_LIMIT = 24;
export const COMPLETE_CHARACTER_PACK_FORMAT = '8-bit-sprite-assembler-complete-character-pack';
export const COMPLETE_CHARACTER_PACK_VERSION = 8;
export const COMPLETE_CHARACTER_KIT_LAYER_ORDER = [
  'weapon-back',
  'shield-back',
  'species-back',
  'outfit-back',
  'outfit',
  'skin-body',
  'head',
  'expression',
  'species-front',
  'face-detail',
  'hair',
  'headgear',
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
  return {
    ...player,
    kind: 'player',
    species: player.species || 'human',
    bodyBuild: player.bodyBuild || 'classic',
    expression: player.expression || 'neutral',
    outfitTier: player.outfitTier || 'tier1',
    palette: clonePalette(player.palette),
  };
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
    species: player.species || 'human',
    speciesName: SPECIES.find((item) => item.id === (player.species || 'human'))?.name || player.species || 'Human',
    bodyBuild: player.bodyBuild || 'classic',
    bodyBuildName: BODY_BUILDS.find((item) => item.id === (player.bodyBuild || 'classic'))?.name || player.bodyBuild || 'Classic',
    skin: player.skin,
    skinName: SKINS.find((item) => item.id === player.skin)?.name || player.skin,
    hairStyle: player.hairStyle,
    hairColor: player.hairColor,
    hairColorName: HAIR_COLORS.find((item) => item.id === player.hairColor)?.name || player.hairColor,
    expression: player.expression || 'neutral',
    expressionName: EXPRESSIONS.find((item) => item.id === (player.expression || 'neutral'))?.name || player.expression || 'Neutral',
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

const COMPONENT_BASE_PLAYER = {
  kind: 'player',
  species: 'human',
  bodyBuild: 'classic',
  skin: 'peach',
  hairStyle: 'short',
  hairColor: 'brown',
  expression: 'neutral',
  faceDetail: 'none',
  headgear: 'none',
  outfit: 'tunic',
  outfitTier: 'tier1',
  outfitColor: 'royal',
  weapon: 'none',
  weaponTier: 'tier1',
  shield: 'none',
  shieldTier: 'tier1',
  palette: null,
};

const COLOR_AWARE_HEADGEAR = new Set(['cap', 'hood', 'wizard', 'bandana', 'plumed']);

function componentSpec(patch = {}) {
  return clonePlayer({ ...COMPONENT_BASE_PLAYER, ...patch });
}

function skinBodyFile(skin) {
  return `components/skin-body/${skin}.png`;
}

function headFile(skin, shade) {
  return `components/heads/${skin}/${shade}.png`;
}

function hairFile(style, color, fit) {
  if (fit === 'under-headgear' && ['short', 'spiky', 'bowl', 'topknot'].includes(style)) {
    return `components/hair/short-spiky-bowl-topknot/${color}/${fit}.png`;
  }
  return `components/hair/${style}/${color}/${fit}.png`;
}

function faceDetailFile(detail, variant = 'default') {
  return `components/face-details/${detail}/${variant}.png`;
}

function expressionFile(expression) {
  return `components/expressions/${expression}.png`;
}

function speciesFile(species, pass, variant = 'default') {
  return `components/species/${species}/${pass}/${variant}.png`;
}

function outfitFile(outfit, tier, color, bodyBuild = 'classic') {
  const variant = ['leather', 'plate'].includes(outfit) ? 'default' : color;
  return `components/outfits/${outfit}/${tier}/${variant}/${bodyBuild}/front.png`;
}

function outfitBackFile(outfit, tier, color, bodyBuild = 'classic') {
  return `components/outfits/${outfit}/${tier}/${color}/${bodyBuild}/back.png`;
}

function headgearFile(headgear, color = 'default') {
  return `components/headgear/${headgear}/${color}.png`;
}

function shieldPassUsesColor(shield, tier, pass) {
  if (tier === 'tier5' && pass === 'back' && ['round', 'buckler', 'oval'].includes(shield)) return false;
  if (tier === 'tier5' && pass === 'front' && shield === 'kite') return false;
  if (pass === 'back') return !['bone', 'arcane'].includes(shield);
  return !['round', 'oval', 'buckler', 'bone', 'arcane'].includes(shield);
}

function completeShieldFile(shield, tier, color, pass) {
  const variant = shieldPassUsesColor(shield, tier, pass) ? color : 'default';
  return `components/shields/${shield}/${tier}/${pass}/${variant}.png`;
}

function completeRecipeEntries(rawEntries) {
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
      role: typeof raw.role === 'string' && raw.role.trim() ? raw.role.trim() : null,
      player: clonePlayer(player),
    }];
  });
}

function faceDetailComponent(player, hidden) {
  if (hidden || player.faceDetail === 'none') return null;
  if (player.faceDetail === 'beard' || player.faceDetail === 'mustache') {
    return faceDetailFile(player.faceDetail, player.hairColor);
  }
  if (player.faceDetail === 'scar') return faceDetailFile('scar', player.skin);
  if (player.faceDetail === 'warpaint') return faceDetailFile('warpaint', player.outfitColor);
  return faceDetailFile(player.faceDetail);
}

function recipeComponents(player) {
  const gear = HEADGEAR.find((entry) => entry.id === player.headgear) || HEADGEAR[0];
  const hideHead = Boolean(gear.hideAll);
  const hairFit = gear.hideTop ? 'under-headgear' : 'full';
  const equippedWeapon = player.weapon !== 'none';
  const equippedShield = player.shield !== 'none';
  const outfitTier = player.outfitTier || 'tier1';
  const gearColor = COLOR_AWARE_HEADGEAR.has(player.headgear) ? player.outfitColor : 'default';
  const species = player.species || 'human';
  const bodyBuild = player.bodyBuild || 'classic';
  const speciesBack = species === 'tiefling'
    ? speciesFile(species, 'back', player.skin)
    : species === 'celestial'
      ? speciesFile(species, 'back')
      : null;
  const speciesFront = hideHead || species === 'human'
    ? null
    : ['elf', 'orc', 'goblin'].includes(species)
      ? speciesFile(species, 'front', player.skin)
      : speciesFile(species, 'front');

  return {
    weaponBack: equippedWeapon ? `components/weapons/${player.weapon}/${player.weaponTier}/back.png` : null,
    shieldBack: equippedShield ? completeShieldFile(player.shield, player.shieldTier, player.outfitColor, 'back') : null,
    speciesBack,
    outfitBack: player.outfit === 'cape' ? outfitBackFile(player.outfit, outfitTier, player.outfitColor, bodyBuild) : null,
    outfit: outfitFile(player.outfit, outfitTier, player.outfitColor, bodyBuild),
    skinBody: skinBodyFile(player.skin),
    head: hideHead ? null : headFile(player.skin, gear.shade ? 'shaded' : 'normal'),
    expression: hideHead ? null : expressionFile(player.expression || 'neutral'),
    speciesFront,
    faceDetail: faceDetailComponent(player, hideHead),
    hair: hideHead || player.hairStyle === 'bald'
      ? null
      : hairFile(player.hairStyle, player.hairColor, hairFit),
    headgear: player.headgear === 'none' ? null : headgearFile(player.headgear, gearColor),
    shieldFront: equippedShield ? completeShieldFile(player.shield, player.shieldTier, player.outfitColor, 'front') : null,
    weaponFront: equippedWeapon ? `components/weapons/${player.weapon}/${player.weaponTier}/front.png` : null,
  };
}

function buildSpeciesComponents() {
  const back = [];
  const front = [];
  for (const species of SPECIES.filter((entry) => entry.id !== 'human')) {
    const backVariants = species.id === 'tiefling'
      ? SKINS
      : species.id === 'celestial'
        ? [null]
        : [];
    for (const skin of backVariants) {
      back.push({
        species: species.id,
        speciesName: species.name,
        variant: skin?.id || 'default',
        variantName: skin?.name || 'Fixed colors',
        file: speciesFile(species.id, 'back', skin?.id || 'default'),
        layer: 'species-back',
        spec: componentSpec({ species: species.id, skin: skin?.id || 'peach' }),
      });
    }

    const frontVariants = ['elf', 'orc', 'goblin'].includes(species.id) ? SKINS : [null];
    for (const skin of frontVariants) {
      front.push({
        species: species.id,
        speciesName: species.name,
        variant: skin?.id || 'default',
        variantName: skin?.name || 'Fixed colors',
        file: speciesFile(species.id, 'front', skin?.id || 'default'),
        layer: 'species-front',
        spec: componentSpec({ species: species.id, skin: skin?.id || 'peach' }),
      });
    }
  }
  return { back, front };
}

function buildSkinBodies() {
  return SKINS.map((skin) => ({
    skin: skin.id,
    skinName: skin.name,
    colors: clonePair(skin.c),
    file: skinBodyFile(skin.id),
    layer: 'skin-body',
    spec: componentSpec({ skin: skin.id }),
  }));
}

function buildHeads() {
  return SKINS.flatMap((skin) => ['normal', 'shaded'].map((shade) => ({
    skin: skin.id,
    skinName: skin.name,
    colors: clonePair(skin.c),
    shade,
    file: headFile(skin.id, shade),
    layer: 'head',
    spec: componentSpec({
      skin: skin.id,
      hairStyle: 'bald',
      headgear: shade === 'shaded' ? 'hood' : 'none',
    }),
  })));
}

function buildHairComponents() {
  const byFile = new Map();
  for (const style of HAIR_STYLES.filter((entry) => entry.id !== 'bald')) {
    for (const color of HAIR_COLORS) {
      for (const fit of ['full', 'under-headgear']) {
        const file = hairFile(style.id, color.id, fit);
        const existing = byFile.get(file);
        if (existing) {
          existing.compatibleStyles.push(style.id);
          continue;
        }
        byFile.set(file, {
          style: style.id,
          styleName: style.name,
          compatibleStyles: [style.id],
          color: color.id,
          colorName: color.name,
          colors: clonePair(color.c),
          fit,
          file,
          layer: 'hair',
          spec: componentSpec({
            hairStyle: style.id,
            hairColor: color.id,
            headgear: fit === 'under-headgear' ? 'wizard' : 'none',
          }),
        });
      }
    }
  }
  return [...byFile.values()];
}

function buildFaceDetailComponents() {
  const entries = [];
  for (const detail of ['beard', 'mustache']) {
    for (const color of HAIR_COLORS) {
      entries.push({
        detail,
        detailName: FACIAL_DETAILS.find((entry) => entry.id === detail)?.name || detail,
        variant: color.id,
        variantName: color.name,
        file: faceDetailFile(detail, color.id),
        layer: 'face-detail',
        spec: componentSpec({ faceDetail: detail, hairColor: color.id }),
      });
    }
  }
  for (const skin of SKINS) {
    entries.push({
      detail: 'scar',
      detailName: 'Scar',
      variant: skin.id,
      variantName: skin.name,
      file: faceDetailFile('scar', skin.id),
      layer: 'face-detail',
      spec: componentSpec({ faceDetail: 'scar', skin: skin.id }),
    });
  }
  for (const detail of ['eyepatch', 'glasses', 'blush']) {
    entries.push({
      detail,
      detailName: FACIAL_DETAILS.find((entry) => entry.id === detail)?.name || detail,
      variant: 'default',
      variantName: 'Default',
      file: faceDetailFile(detail),
      layer: 'face-detail',
      spec: componentSpec({ faceDetail: detail }),
    });
  }
  for (const color of OUTFIT_COLORS) {
    entries.push({
      detail: 'warpaint',
      detailName: 'War paint',
      variant: color.id,
      variantName: color.name,
      file: faceDetailFile('warpaint', color.id),
      layer: 'face-detail',
      spec: componentSpec({ faceDetail: 'warpaint', outfitColor: color.id }),
    });
  }
  return entries;
}

function buildExpressionComponents() {
  return EXPRESSIONS.map((expression) => ({
    expression: expression.id,
    expressionName: expression.name,
    file: expressionFile(expression.id),
    layer: 'expression',
    spec: componentSpec({ expression: expression.id }),
  }));
}

function buildOutfitComponents() {
  const front = [];
  const back = [];
  for (const bodyBuild of BODY_BUILDS) {
    for (const outfit of OUTFITS) {
      for (const tier of OUTFIT_TIERS) {
        const colors = ['leather', 'plate'].includes(outfit.id) ? [null] : OUTFIT_COLORS;
        for (const color of colors) {
          const renderColor = color?.id || OUTFIT_COLORS[0].id;
          const spec = componentSpec({
            bodyBuild: bodyBuild.id,
            outfit: outfit.id,
            outfitTier: tier.id,
            outfitColor: renderColor,
          });
          front.push({
            bodyBuild: bodyBuild.id,
            bodyBuildName: bodyBuild.name,
            outfit: outfit.id,
            outfitName: outfit.name,
            tier: tier.id,
            tierName: tier.name,
            color: color?.id || 'default',
            colorName: color?.name || 'Fixed colors',
            colors: color ? clonePair(color.c) : null,
            file: outfitFile(outfit.id, tier.id, renderColor, bodyBuild.id),
            layer: 'outfit',
            spec,
          });
          if (outfit.id === 'cape') {
            back.push({
              bodyBuild: bodyBuild.id,
              bodyBuildName: bodyBuild.name,
              outfit: outfit.id,
              outfitName: outfit.name,
              tier: tier.id,
              tierName: tier.name,
              color: color.id,
              colorName: color.name,
              colors: clonePair(color.c),
              file: outfitBackFile(outfit.id, tier.id, color.id, bodyBuild.id),
              layer: 'outfit-back',
              spec,
            });
          }
        }
      }
    }
  }
  return { front, back };
}

function buildCompleteShieldComponents() {
  const entries = [];
  for (const shield of SHIELDS.filter((entry) => entry.id !== 'none')) {
    for (const tier of SHIELD_TIERS) {
      for (const pass of ['back', 'front']) {
        const colors = shieldPassUsesColor(shield.id, tier.id, pass) ? OUTFIT_COLORS : [null];
        for (const color of colors) {
          const renderColor = color?.id || OUTFIT_COLORS[0].id;
          entries.push({
            shield: shield.id,
            shieldName: shield.name,
            tier: tier.id,
            tierName: tier.name,
            pass,
            color: color?.id || 'default',
            colorName: color?.name || 'Fixed colors',
            colors: color ? clonePair(color.c) : null,
            file: completeShieldFile(shield.id, tier.id, renderColor, pass),
            layer: `shield-${pass}`,
            spec: componentSpec({
              shield: shield.id,
              shieldTier: tier.id,
              outfitColor: renderColor,
            }),
          });
        }
      }
    }
  }
  return entries;
}

function buildHeadgearComponents() {
  return HEADGEAR
    .filter((gear) => gear.id !== 'none')
    .flatMap((gear) => {
      const colors = COLOR_AWARE_HEADGEAR.has(gear.id) ? OUTFIT_COLORS : [null];
      return colors.map((color) => ({
        headgear: gear.id,
        headgearName: gear.name,
        color: color?.id || 'default',
        colorName: color?.name || 'Fixed colors',
        file: headgearFile(gear.id, color?.id || 'default'),
        layer: 'headgear',
        spec: componentSpec({ headgear: gear.id, outfitColor: color?.id || 'royal' }),
      }));
    });
}

function buildEnemyLibrary() {
  return ENEMIES.map((family) => ({
    family: family.id,
    name: family.name,
    variants: family.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      file: `enemies/${family.id}/${variant.id}.png`,
      spec: { kind: 'enemy', family: family.id, variant: variant.id },
    })),
  }));
}

function buildEffectLibrary() {
  return COMBAT_EFFECTS.map((category) => ({
    category: category.id,
    name: category.name,
    effects: category.effects.map((effect) => ({
      id: effect.id,
      name: effect.name,
      file: `effects/${category.id}/${effect.id}.png`,
      spec: { kind: 'effect', category: category.id, effect: effect.id },
    })),
  }));
}

export function completeCharacterKitCounts() {
  const skinBodies = SKINS.length;
  const heads = SKINS.length * 2;
  const hair = ((HAIR_STYLES.length - 1) * HAIR_COLORS.length * 2) - (3 * HAIR_COLORS.length);
  const expressions = EXPRESSIONS.length;
  const faceDetails = (2 * HAIR_COLORS.length) + SKINS.length + 3 + OUTFIT_COLORS.length;
  const speciesBack = SKINS.length + 1;
  const speciesFront = (3 * SKINS.length) + 2;
  const outfitFront = BODY_BUILDS.length * OUTFIT_TIERS.length * (((OUTFITS.length - 2) * OUTFIT_COLORS.length) + 2);
  const outfitBack = BODY_BUILDS.length * OUTFIT_TIERS.length * OUTFIT_COLORS.length;
  const headgear = (COLOR_AWARE_HEADGEAR.size * OUTFIT_COLORS.length)
    + ((HEADGEAR.length - 1) - COLOR_AWARE_HEADGEAR.size);
  const weaponLayers = (WEAPONS.length - 1) * WEAPON_TIERS.length * 2;
  const shieldLayers = SHIELD_TIERS.reduce((tierTotal, tier) => (
    tierTotal + SHIELDS.filter((shield) => shield.id !== 'none').reduce((shieldTotal, shield) => (
      shieldTotal + ['back', 'front'].reduce((passTotal, pass) => (
        passTotal + (shieldPassUsesColor(shield.id, tier.id, pass) ? OUTFIT_COLORS.length : 1)
      ), 0)
    ), 0)
  ), 0);
  const componentPngs = skinBodies + heads + hair + expressions + faceDetails + speciesBack + speciesFront + outfitFront + outfitBack
    + headgear + weaponLayers + shieldLayers;
  const enemyFamilies = ENEMIES.length;
  const enemySheets = ENEMIES.reduce((total, family) => total + family.variants.length, 0);
  const effectCategories = COMBAT_EFFECTS.length;
  const effectSheets = COMBAT_EFFECTS.reduce((total, category) => total + category.effects.length, 0);
  return {
    skinBodies,
    heads,
    hair,
    expressions,
    faceDetails,
    speciesBack,
    speciesFront,
    outfitFront,
    outfitBack,
    headgear,
    weaponLayers,
    shieldLayers,
    componentPngs,
    enemyFamilies,
    enemySheets,
    effectCategories,
    effectSheets,
    referencePreviews: 1,
    totalPngs: componentPngs + enemySheets + effectSheets + 1,
  };
}

export function buildCompleteCharacterKitPlan(rawRecipes = []) {
  const recipeEntries = completeRecipeEntries(rawRecipes);
  if (recipeEntries.length > COMPLETE_CHARACTER_KIT_RECIPE_LIMIT) {
    throw new RangeError(`A Complete Character Kit supports up to ${COMPLETE_CHARACTER_KIT_RECIPE_LIMIT} saved recipes.`);
  }

  const skinBodies = buildSkinBodies();
  const heads = buildHeads();
  const hair = buildHairComponents();
  const expressions = buildExpressionComponents();
  const faceDetails = buildFaceDetailComponents();
  const species = buildSpeciesComponents();
  const outfits = buildOutfitComponents();
  const headgear = buildHeadgearComponents();
  const weapons = buildWeapons(COMPONENT_BASE_PLAYER, 'components/weapons');
  const shields = buildCompleteShieldComponents();
  const enemies = buildEnemyLibrary();
  const effects = buildEffectLibrary();
  const usedIds = new Set();
  const recipes = recipeEntries.map((entry, index) => ({
    id: uniqueCharacterId(entry.name, index, usedIds),
    sourceId: entry.sourceId,
    name: entry.name,
    role: entry.role,
    spec: clonePlayer(entry.player),
    components: recipeComponents(entry.player),
  }));
  const referenceSpec = recipes[0]?.spec || clonePlayer(COMPONENT_BASE_PLAYER);

  return {
    components: {
      skinBodies,
      heads,
      hair,
      expressions,
      faceDetails,
      speciesBack: species.back,
      speciesFront: species.front,
      outfitBack: outfits.back,
      outfits: outfits.front,
      headgear,
      weapons,
      shields,
    },
    enemies,
    effects,
    recipes,
    reference: {
      file: 'preview/reference-character.png',
      spec: referenceSpec,
    },
    counts: completeCharacterKitCounts(),
  };
}
