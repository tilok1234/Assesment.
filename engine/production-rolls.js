import {
  BODY_BUILDS,
  EXPRESSIONS,
  FACIAL_DETAILS,
  HAIR_COLORS,
  HAIR_STYLES,
  HEADGEAR,
  OFFHANDS,
  OUTFITS,
  OUTFIT_COLORS,
  OUTFIT_TIERS,
  SHIELDS,
  SHIELD_TIERS,
  SKINS,
  SPECIES,
  WEAPONS,
  WEAPON_TIERS,
} from './catalogs.js';
import { CLASS_TEMPLATES } from './class-templates.js';

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

export const PRODUCTION_ROLL_PROFILE = Object.freeze({
  id: 'production-v1',
  version: 1,
});

export const PRODUCTION_ROLL_MAX_ATTEMPTS = 24;

export const PRODUCTION_ROLL_REASON_CODES = Object.freeze({
  INVALID_PLAYER: 'invalid-player',
  INVALID_ARCHETYPE: 'invalid-archetype',
  INVALID_POWER_TIER: 'invalid-power-tier',
  INVALID_PALETTE_FAMILY: 'invalid-palette-family',
  INVALID_CATALOG_ID: 'invalid-catalog-id',
  UNCLASSIFIED_CATALOG_ID: 'unclassified-catalog-id',
  CLASS_OUTFIT: 'class-outfit',
  CLASS_WEAPON: 'class-weapon',
  CLASS_SHIELD: 'class-shield',
  CLASS_OFFHAND: 'class-offhand',
  EQUIPMENT_PAIR: 'equipment-pair',
  HAND_CONFLICT: 'hand-conflict',
  OUTFIT_TIER: 'outfit-tier',
  WEAPON_TIER: 'weapon-tier',
  SHIELD_TIER: 'shield-tier',
  HIDDEN_EXPRESSION: 'hidden-expression',
  HIDDEN_FACE_DETAIL: 'hidden-face-detail',
  HIDDEN_HAIR: 'hidden-hair',
  HEAD_IDENTITY_COVERED: 'head-identity-covered',
  PALETTE_FAMILY: 'palette-family',
  CUSTOM_PALETTE: 'custom-palette',
  COMPLEXITY_LIMIT: 'complexity-limit',
});

function weightedEntries(weights) {
  return Object.freeze(Object.entries(weights).map(([id, weight]) => Object.freeze({ id, weight })));
}

function paletteFamily(id, name, skins, hair, outfits) {
  return deepFreeze({
    id,
    name,
    skins: weightedEntries(skins),
    hair: weightedEntries(hair),
    outfits: weightedEntries(outfits),
  });
}

export const PRODUCTION_PALETTE_FAMILIES = Object.freeze([
  paletteFamily(
    'grounded',
    'Grounded',
    { pale: 1, peach: 3, tan: 4, brown: 4, deep: 2, orc: 1 },
    { black: 3, brown: 5, blonde: 1, ginger: 2, white: 1 },
    { umber: 5, forest: 3, charcoal: 3, crimson: 1, teal: 1 },
  ),
  paletteFamily(
    'royal',
    'Royal',
    { pale: 2, peach: 4, tan: 3, brown: 2, deep: 1, orc: 1 },
    { black: 3, brown: 3, blonde: 4, ginger: 1, white: 2 },
    { royal: 5, crimson: 4, purple: 2, charcoal: 1 },
  ),
  paletteFamily(
    'wilderness',
    'Wilderness',
    { peach: 1, tan: 4, brown: 4, deep: 3, orc: 3 },
    { black: 2, brown: 5, blonde: 1, ginger: 3, white: 1 },
    { forest: 5, umber: 4, teal: 2, charcoal: 1 },
  ),
  paletteFamily(
    'arcane',
    'Arcane',
    { pale: 3, peach: 2, tan: 1, brown: 1, deep: 2, orc: 1 },
    { black: 2, brown: 1, blonde: 1, white: 3, blue: 5, pink: 2 },
    { purple: 5, teal: 4, royal: 2, charcoal: 2 },
  ),
  paletteFamily(
    'divine',
    'Divine',
    { pale: 4, peach: 4, tan: 2, brown: 1, deep: 1, orc: 1 },
    { black: 1, brown: 2, blonde: 4, ginger: 1, white: 5, blue: 1 },
    { royal: 4, teal: 3, crimson: 2, charcoal: 1 },
  ),
  paletteFamily(
    'infernal',
    'Infernal',
    { pale: 1, peach: 1, tan: 1, brown: 3, deep: 5, orc: 4 },
    { black: 5, brown: 2, ginger: 4, white: 1, pink: 2 },
    { crimson: 5, purple: 4, charcoal: 3, umber: 2 },
  ),
  paletteFamily(
    'necromantic',
    'Necromantic',
    { pale: 4, peach: 1, brown: 2, deep: 4, orc: 2 },
    { black: 5, brown: 1, white: 5, blue: 2 },
    { charcoal: 5, purple: 4, umber: 3, teal: 1 },
  ),
]);

export const PRODUCTION_ROLL_FREEZE = deepFreeze({
  status: 'frozen',
  acceptedCorpus: {
    format: '8-bit-sprite-assembler-production-roll-review',
    version: 1,
    pairs: 120,
    pairsPerClass: 12,
    digest: 'af9b620e5ce87f6febf5983487fc163e8b5a4495fb37ced3653e8b5bbbc4ba3f',
    approved: true,
    approvedOn: '2026-07-26',
  },
  presentation: {
    shadeMode: 'form',
    outlineMode: null,
    effects: 'off',
  },
  catalogIds: {
    archetypes: [
      'warrior', 'guardian', 'ranger', 'rogue', 'mage',
      'cleric', 'barbarian', 'necromancer', 'paladin', 'druid',
    ],
    species: [
      'human', 'elf', 'orc', 'goblin', 'tiefling',
      'celestial', 'dwarf', 'undead', 'lizardfolk', 'beastkin',
    ],
    bodyBuilds: ['classic', 'lean', 'sturdy', 'heroic'],
    skins: ['pale', 'peach', 'tan', 'brown', 'deep', 'orc'],
    hairStyles: [
      'bald', 'short', 'spiky', 'bowl', 'long', 'ponytail',
      'mohawk', 'braids', 'afro', 'topknot', 'messy',
    ],
    hairColors: ['black', 'brown', 'blonde', 'ginger', 'white', 'blue', 'pink'],
    expressions: ['neutral', 'happy', 'angry', 'sad', 'surprised', 'determined'],
    faceDetails: ['none', 'beard', 'mustache', 'scar', 'eyepatch', 'glasses', 'blush', 'warpaint'],
    headgear: [
      'none', 'cap', 'helm', 'fullhelm', 'hood', 'crown',
      'wizard', 'horns', 'bandana', 'circlet', 'plumed', 'skullmask',
    ],
    outfits: [
      'tunic', 'leather', 'plate', 'robe', 'cape',
      'barbarian', 'ranger', 'cleric', 'necromancer',
    ],
    outfitTiers: ['tier1', 'tier2', 'tier3', 'tier4', 'tier5'],
    outfitColors: ['crimson', 'royal', 'forest', 'purple', 'umber', 'teal', 'charcoal'],
    weapons: [
      'none', 'sword', 'greatsword', 'scimitar', 'rapier', 'dagger', 'axe', 'mace',
      'warhammer', 'spear', 'club', 'bow', 'crossbow', 'staff', 'wand', 'spellbook',
    ],
    weaponTiers: ['tier1', 'tier2', 'tier3', 'tier4', 'tier5'],
    shields: ['none', 'round', 'kite', 'buckler', 'heater', 'tower', 'oval', 'bone', 'arcane'],
    shieldTiers: ['tier1', 'tier2', 'tier3', 'tier4', 'tier5'],
    offhands: ['none', 'lantern'],
    paletteFamilies: ['grounded', 'royal', 'wilderness', 'arcane', 'divine', 'infernal', 'necromantic'],
  },
  classTemplates: [
    {
      id: 'warrior',
      outfit: 'plate',
      weapons: ['sword', 'greatsword', 'axe', 'mace', 'warhammer', 'spear'],
      shields: ['round', 'kite', 'heater', 'tower'],
      offhands: [],
    },
    {
      id: 'guardian',
      outfit: 'plate',
      weapons: ['sword', 'mace', 'warhammer', 'spear'],
      shields: ['round', 'kite', 'heater', 'tower', 'oval', 'bone'],
      offhands: [],
    },
    {
      id: 'ranger',
      outfit: 'ranger',
      weapons: ['dagger', 'spear', 'bow', 'crossbow'],
      shields: ['buckler'],
      offhands: ['lantern'],
    },
    {
      id: 'rogue',
      outfit: 'leather',
      weapons: ['scimitar', 'rapier', 'dagger', 'crossbow'],
      shields: ['buckler'],
      offhands: [],
    },
    {
      id: 'mage',
      outfit: 'robe',
      weapons: ['staff', 'wand', 'spellbook'],
      shields: ['arcane'],
      offhands: ['lantern'],
    },
    {
      id: 'cleric',
      outfit: 'cleric',
      weapons: ['mace', 'warhammer', 'staff', 'wand'],
      shields: ['round', 'heater', 'arcane'],
      offhands: ['lantern'],
    },
    {
      id: 'barbarian',
      outfit: 'barbarian',
      weapons: ['greatsword', 'axe', 'spear', 'club'],
      shields: [],
      offhands: [],
    },
    {
      id: 'necromancer',
      outfit: 'necromancer',
      weapons: ['dagger', 'staff', 'wand', 'spellbook'],
      shields: ['bone', 'arcane'],
      offhands: ['lantern'],
    },
    {
      id: 'paladin',
      outfit: 'plate',
      weapons: ['sword', 'greatsword', 'mace', 'warhammer'],
      shields: ['kite', 'heater', 'tower'],
      offhands: [],
    },
    {
      id: 'druid',
      outfit: 'ranger',
      weapons: ['dagger', 'spear', 'staff', 'wand'],
      shields: ['round', 'bone'],
      offhands: ['lantern'],
    },
  ],
});

const PRODUCTION_CATALOG_SOURCES = Object.freeze({
  archetypes: CLASS_TEMPLATES,
  species: SPECIES,
  bodyBuilds: BODY_BUILDS,
  skins: SKINS,
  hairStyles: HAIR_STYLES,
  hairColors: HAIR_COLORS,
  expressions: EXPRESSIONS,
  faceDetails: FACIAL_DETAILS,
  headgear: HEADGEAR,
  outfits: OUTFITS,
  outfitTiers: OUTFIT_TIERS,
  outfitColors: OUTFIT_COLORS,
  weapons: WEAPONS,
  weaponTiers: WEAPON_TIERS,
  shields: SHIELDS,
  shieldTiers: SHIELD_TIERS,
  offhands: OFFHANDS,
  paletteFamilies: PRODUCTION_PALETTE_FAMILIES,
});

function catalogIds(catalog) {
  if (!Array.isArray(catalog)) return [];
  return catalog
    .map((entry) => (typeof entry === 'string' ? entry : entry?.id))
    .filter((id) => typeof id === 'string');
}

export function auditProductionRollCatalogs(overrides = {}) {
  const missing = [];
  const unclassified = [];
  const duplicates = [];
  for (const [category, expectedIds] of Object.entries(PRODUCTION_ROLL_FREEZE.catalogIds)) {
    const source = Object.prototype.hasOwnProperty.call(overrides, category)
      ? overrides[category]
      : PRODUCTION_CATALOG_SOURCES[category];
    const actualIds = catalogIds(source);
    const expected = new Set(expectedIds);
    const actual = new Set(actualIds);
    for (const id of expectedIds) {
      if (!actual.has(id)) missing.push(`${category}:${id}`);
    }
    for (const id of actual) {
      if (!expected.has(id)) unclassified.push(`${category}:${id}`);
    }
    for (const id of actual) {
      if (actualIds.filter((candidate) => candidate === id).length > 1) {
        duplicates.push(`${category}:${id}`);
      }
    }
  }
  return deepFreeze({
    valid: missing.length === 0 && unclassified.length === 0 && duplicates.length === 0,
    missing: missing.sort(),
    unclassified: unclassified.sort(),
    duplicates: duplicates.sort(),
  });
}

function comparableClassTemplate(template) {
  return {
    id: template?.id,
    outfit: template?.outfit,
    weapons: Array.isArray(template?.weapons) ? [...template.weapons] : [],
    shields: Array.isArray(template?.shields) ? [...template.shields] : [],
    offhands: Array.isArray(template?.offhands) ? [...template.offhands] : [],
  };
}

export function auditProductionRollClassTemplates(templates = CLASS_TEMPLATES) {
  const expectedById = new Map(PRODUCTION_ROLL_FREEZE.classTemplates.map((template) => [
    template.id,
    template,
  ]));
  const actualTemplates = Array.isArray(templates) ? templates : [];
  const actualById = new Map(actualTemplates.map((template) => [template?.id, template]));
  const missing = [];
  const unclassified = [];
  const changed = [];
  for (const id of expectedById.keys()) {
    if (!actualById.has(id)) missing.push(id);
  }
  for (const id of actualById.keys()) {
    if (!expectedById.has(id)) unclassified.push(id);
  }
  for (const [id, expected] of expectedById) {
    const actual = actualById.get(id);
    if (
      actual
      && JSON.stringify(comparableClassTemplate(actual)) !== JSON.stringify(expected)
    ) changed.push(id);
  }
  return deepFreeze({
    valid: missing.length === 0 && unclassified.length === 0 && changed.length === 0,
    missing: missing.sort(),
    unclassified: unclassified.sort(),
    changed: changed.sort(),
  });
}

const DEFAULT_SEED = `${PRODUCTION_ROLL_PROFILE.id}:default`;
const UINT32_RANGE = 0x100000000;
const COMPLEXITY_LIMIT = 5;
const COMPLEXITY_MAJOR_LIMIT = 2;
const HIGH_TIERS = new Set(['tier4', 'tier5']);
const LARGE_HAIR = new Set(['long', 'ponytail', 'braids', 'afro']);
const ACCENT_HAIR = new Set(['mohawk', 'topknot', 'messy']);
const LARGE_HEADGEAR = new Set(['fullhelm', 'wizard', 'horns', 'plumed', 'skullmask']);
const ACCENT_HEADGEAR = new Set(['crown', 'bandana']);
const LARGE_SPECIES = new Set(['tiefling', 'celestial', 'lizardfolk', 'beastkin']);
const ACCENT_SPECIES = new Set(['elf', 'orc', 'goblin', 'dwarf', 'undead']);
const HEAD_IDENTITY_SPECIES = new Set(['elf', 'orc', 'goblin', 'dwarf', 'undead', 'beastkin']);
const LARGE_WEAPONS = new Set(['greatsword', 'axe', 'warhammer', 'spear', 'club', 'bow', 'crossbow', 'staff', 'spellbook']);
const BROAD_SHIELDS = new Set(['kite', 'heater', 'tower', 'oval', 'bone']);
const LARGE_SHIELD_ARCHETYPES = new Set(['warrior', 'guardian', 'cleric', 'paladin']);
const BROAD_SHIELD_INCOMPATIBLE_WEAPONS = new Set([
  'greatsword',
  'warhammer',
  'spear',
  'club',
  'bow',
  'crossbow',
  'staff',
  'spellbook',
]);
const FITTED_HIDDEN_HAIR = new Set(['bald', 'short', 'spiky', 'bowl', 'topknot']);

function approvedIds(category) {
  return new Set(PRODUCTION_ROLL_FREEZE.catalogIds[category]);
}

function approvedCatalog(catalog, category) {
  const approved = approvedIds(category);
  return Object.freeze(catalog.filter((entry) => approved.has(entry.id)));
}

const PRODUCTION_CLASS_TEMPLATES = approvedCatalog(CLASS_TEMPLATES, 'archetypes');
const PRODUCTION_SPECIES = approvedCatalog(SPECIES, 'species');
const PRODUCTION_BODY_BUILDS = approvedCatalog(BODY_BUILDS, 'bodyBuilds');
const PRODUCTION_HAIR_STYLES = approvedCatalog(HAIR_STYLES, 'hairStyles');
const PRODUCTION_EXPRESSIONS = approvedCatalog(EXPRESSIONS, 'expressions');
const PRODUCTION_FACIAL_DETAILS = approvedCatalog(FACIAL_DETAILS, 'faceDetails');
const PRODUCTION_HEADGEAR = approvedCatalog(HEADGEAR, 'headgear');
const PRODUCTION_OUTFIT_TIERS = approvedCatalog(OUTFIT_TIERS, 'outfitTiers');

export function normalizeProductionRollSeed(seed) {
  if (typeof seed !== 'string') return DEFAULT_SEED;
  const normalized = seed.normalize('NFC').trim();
  return normalized || DEFAULT_SEED;
}

function hashSeed(seed) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / UINT32_RANGE;
  };
}

function select(catalog, random) {
  return catalog[Math.floor(random() * catalog.length)];
}

function selectWeighted(entries, random, weightMultiplier = () => 1) {
  const weighted = entries.map((entry) => ({
    entry,
    weight: entry.weight * weightMultiplier(entry),
  }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let target = random() * total;
  for (const item of weighted) {
    target -= item.weight;
    if (target < 0) return item.entry;
  }
  return weighted[weighted.length - 1].entry;
}

function catalogHas(catalog, id) {
  return catalog.some((item) => item.id === id);
}

function headgearDefinition(id) {
  return HEADGEAR.find((item) => item.id === id) || HEADGEAR[0];
}

function isFaceCovering(headgear) {
  const definition = headgearDefinition(headgear);
  return definition.hideAll === true || definition.hideFace === true;
}

function addComplexity(features, id, level) {
  features.push(Object.freeze({
    id,
    level,
    points: level === 'major' ? 2 : 1,
  }));
}

function productionComplexity(player) {
  const features = [];
  if (LARGE_HAIR.has(player.hairStyle)) addComplexity(features, `hair:${player.hairStyle}`, 'major');
  else if (ACCENT_HAIR.has(player.hairStyle)) addComplexity(features, `hair:${player.hairStyle}`, 'minor');

  if (LARGE_HEADGEAR.has(player.headgear)) addComplexity(features, `headgear:${player.headgear}`, 'major');
  else if (ACCENT_HEADGEAR.has(player.headgear)) addComplexity(features, `headgear:${player.headgear}`, 'minor');

  if (LARGE_SPECIES.has(player.species)) addComplexity(features, `species:${player.species}`, 'major');
  else if (ACCENT_SPECIES.has(player.species)) addComplexity(features, `species:${player.species}`, 'minor');

  if (player.outfit === 'cape' || HIGH_TIERS.has(player.outfitTier)) {
    addComplexity(features, `outfit:${player.outfit}:${player.outfitTier}`, 'major');
  } else if (player.outfitTier === 'tier3') {
    addComplexity(features, `outfit:${player.outfit}:${player.outfitTier}`, 'minor');
  }

  if (HIGH_TIERS.has(player.weaponTier) && LARGE_WEAPONS.has(player.weapon)) {
    addComplexity(features, `weapon:${player.weapon}:${player.weaponTier}`, 'major');
  } else if (player.weapon && player.weapon !== 'none' && (HIGH_TIERS.has(player.weaponTier) || LARGE_WEAPONS.has(player.weapon))) {
    addComplexity(features, `weapon:${player.weapon}:${player.weaponTier}`, 'minor');
  }

  if (player.shield && player.shield !== 'none' && HIGH_TIERS.has(player.shieldTier) && BROAD_SHIELDS.has(player.shield)) {
    addComplexity(features, `shield:${player.shield}:${player.shieldTier}`, 'major');
  } else if (player.shield && player.shield !== 'none') {
    addComplexity(features, `shield:${player.shield}:${player.shieldTier}`, 'minor');
  }
  if (player.offhand && player.offhand !== 'none') addComplexity(features, `offhand:${player.offhand}`, 'minor');

  return deepFreeze({
    used: features.reduce((sum, feature) => sum + feature.points, 0),
    limit: COMPLEXITY_LIMIT,
    major: features.filter((feature) => feature.level === 'major').length,
    majorLimit: COMPLEXITY_MAJOR_LIMIT,
    features,
  });
}

export function validateProductionPlayer(player, context = {}) {
  const reasons = new Set();
  const catalogTemplate = CLASS_TEMPLATES.find((item) => item.id === context.archetype);
  const template = PRODUCTION_CLASS_TEMPLATES.find((item) => item.id === context.archetype);
  const powerTierExists = catalogHas(OUTFIT_TIERS, context.powerTier);
  const powerTierValid = catalogHas(PRODUCTION_OUTFIT_TIERS, context.powerTier);
  const palette = PRODUCTION_PALETTE_FAMILIES.find((item) => item.id === context.paletteFamily);
  if (!player || typeof player !== 'object' || Array.isArray(player)) {
    reasons.add(PRODUCTION_ROLL_REASON_CODES.INVALID_PLAYER);
    return deepFreeze({
      valid: false,
      reasons: [...reasons],
      complexity: productionComplexity({}),
    });
  }
  if (!catalogTemplate) reasons.add(PRODUCTION_ROLL_REASON_CODES.INVALID_ARCHETYPE);
  else if (!template) reasons.add(PRODUCTION_ROLL_REASON_CODES.UNCLASSIFIED_CATALOG_ID);
  if (!powerTierExists) reasons.add(PRODUCTION_ROLL_REASON_CODES.INVALID_POWER_TIER);
  else if (!powerTierValid) reasons.add(PRODUCTION_ROLL_REASON_CODES.UNCLASSIFIED_CATALOG_ID);
  if (!palette) reasons.add(PRODUCTION_ROLL_REASON_CODES.INVALID_PALETTE_FAMILY);

  const catalogFields = [
    ['species', SPECIES, 'species'],
    ['bodyBuild', BODY_BUILDS, 'bodyBuilds'],
    ['skin', SKINS, 'skins'],
    ['hairStyle', HAIR_STYLES, 'hairStyles'],
    ['hairColor', HAIR_COLORS, 'hairColors'],
    ['expression', EXPRESSIONS, 'expressions'],
    ['faceDetail', FACIAL_DETAILS, 'faceDetails'],
    ['headgear', HEADGEAR, 'headgear'],
    ['outfit', OUTFITS, 'outfits'],
    ['outfitTier', OUTFIT_TIERS, 'outfitTiers'],
    ['outfitColor', OUTFIT_COLORS, 'outfitColors'],
    ['weapon', WEAPONS, 'weapons'],
    ['weaponTier', WEAPON_TIERS, 'weaponTiers'],
    ['shield', SHIELDS, 'shields'],
    ['shieldTier', SHIELD_TIERS, 'shieldTiers'],
    ['offhand', OFFHANDS, 'offhands'],
  ];
  if (catalogFields.some(([field, catalog]) => !catalogHas(catalog, player[field]))) {
    reasons.add(PRODUCTION_ROLL_REASON_CODES.INVALID_CATALOG_ID);
  }
  if (catalogFields.some(([field, , category]) => (
    !PRODUCTION_ROLL_FREEZE.catalogIds[category].includes(player[field])
  ))) reasons.add(PRODUCTION_ROLL_REASON_CODES.UNCLASSIFIED_CATALOG_ID);

  if (template) {
    if (player.outfit !== template.outfit) reasons.add(PRODUCTION_ROLL_REASON_CODES.CLASS_OUTFIT);
    if (!template.weapons.includes(player.weapon)) reasons.add(PRODUCTION_ROLL_REASON_CODES.CLASS_WEAPON);
    if (player.shield !== 'none' && !template.shields.includes(player.shield)) {
      reasons.add(PRODUCTION_ROLL_REASON_CODES.CLASS_SHIELD);
    }
    if (player.offhand !== 'none' && !template.offhands.includes(player.offhand)) {
      reasons.add(PRODUCTION_ROLL_REASON_CODES.CLASS_OFFHAND);
    }
  }

  if (player.shield !== 'none' && player.offhand !== 'none') {
    reasons.add(PRODUCTION_ROLL_REASON_CODES.HAND_CONFLICT);
  }
  if (
    BROAD_SHIELD_INCOMPATIBLE_WEAPONS.has(player.weapon)
    && BROAD_SHIELDS.has(player.shield)
  ) {
    reasons.add(PRODUCTION_ROLL_REASON_CODES.EQUIPMENT_PAIR);
  }
  if (
    template
    && powerTierValid
    && HIGH_TIERS.has(context.powerTier)
    && BROAD_SHIELDS.has(player.shield)
    && !LARGE_SHIELD_ARCHETYPES.has(template.id)
  ) {
    reasons.add(PRODUCTION_ROLL_REASON_CODES.EQUIPMENT_PAIR);
  }

  if (powerTierValid) {
    if (player.outfitTier !== context.powerTier) reasons.add(PRODUCTION_ROLL_REASON_CODES.OUTFIT_TIER);
    if (player.weapon === 'none') {
      if (player.weaponTier !== 'tier1') reasons.add(PRODUCTION_ROLL_REASON_CODES.WEAPON_TIER);
    } else if (player.weaponTier !== context.powerTier) {
      reasons.add(PRODUCTION_ROLL_REASON_CODES.WEAPON_TIER);
    }
    if (player.shield === 'none') {
      if (player.shieldTier !== 'tier1') reasons.add(PRODUCTION_ROLL_REASON_CODES.SHIELD_TIER);
    } else if (player.shieldTier !== context.powerTier) {
      reasons.add(PRODUCTION_ROLL_REASON_CODES.SHIELD_TIER);
    }
  }

  if (isFaceCovering(player.headgear)) {
    if (player.expression !== 'neutral') reasons.add(PRODUCTION_ROLL_REASON_CODES.HIDDEN_EXPRESSION);
    if (player.faceDetail !== 'none') reasons.add(PRODUCTION_ROLL_REASON_CODES.HIDDEN_FACE_DETAIL);
    if (HEAD_IDENTITY_SPECIES.has(player.species)) {
      reasons.add(PRODUCTION_ROLL_REASON_CODES.HEAD_IDENTITY_COVERED);
    }
  }
  if (headgearDefinition(player.headgear).hideAll && !FITTED_HIDDEN_HAIR.has(player.hairStyle)) {
    reasons.add(PRODUCTION_ROLL_REASON_CODES.HIDDEN_HAIR);
  }

  if (palette) {
    if (
      !palette.skins.some((entry) => entry.id === player.skin)
      || !palette.hair.some((entry) => entry.id === player.hairColor)
      || !palette.outfits.some((entry) => entry.id === player.outfitColor)
    ) {
      reasons.add(PRODUCTION_ROLL_REASON_CODES.PALETTE_FAMILY);
    }
  }
  if (player.palette != null) reasons.add(PRODUCTION_ROLL_REASON_CODES.CUSTOM_PALETTE);

  const complexity = productionComplexity(player);
  if (complexity.used > complexity.limit || complexity.major > complexity.majorLimit) {
    reasons.add(PRODUCTION_ROLL_REASON_CODES.COMPLEXITY_LIMIT);
  }
  return deepFreeze({
    valid: reasons.size === 0,
    reasons: [...reasons],
    complexity,
  });
}

function selectPaletteId(entries, species, kind, random) {
  return selectWeighted(entries, random, (entry) => {
    if (kind === 'skin' && (species === 'orc' || species === 'goblin') && entry.id === 'orc') return 4;
    if (kind === 'hair' && species === 'undead' && entry.id === 'white') return 3;
    return 1;
  }).id;
}

function leftHandOptions(template, weapon, powerTier) {
  const approvedShields = approvedIds('shields');
  const approvedOffhands = approvedIds('offhands');
  const shields = template.shields.filter((shield) => approvedShields.has(shield) && !(
    BROAD_SHIELD_INCOMPATIBLE_WEAPONS.has(weapon) && BROAD_SHIELDS.has(shield)
  ) && !(
    HIGH_TIERS.has(powerTier)
    && BROAD_SHIELDS.has(shield)
    && !LARGE_SHIELD_ARCHETYPES.has(template.id)
  ));
  return [
    { shield: 'none', offhand: 'none', weight: 3 },
    ...shields.map((shield) => ({ shield, offhand: 'none', weight: 2 })),
    ...template.offhands
      .filter((offhand) => approvedOffhands.has(offhand))
      .map((offhand) => ({ shield: 'none', offhand, weight: 6 })),
  ];
}

function normalizeVisibility(player) {
  const notes = [];
  if (isFaceCovering(player.headgear)) {
    if (player.expression !== 'neutral' || player.faceDetail !== 'none') notes.push('face-covered');
    player.expression = 'neutral';
    player.faceDetail = 'none';
  }
  if (headgearDefinition(player.headgear).hideAll && player.hairStyle !== 'short') {
    player.hairStyle = 'short';
    notes.push('hair-fitted');
  }
  return notes.length ? notes.join(',') : 'none';
}

function buildCandidate(template, powerTier, palette, random) {
  const species = select(PRODUCTION_SPECIES, random).id;
  const headgearChoices = PRODUCTION_HEADGEAR.filter((item) => !(
    HEAD_IDENTITY_SPECIES.has(species) && (item.hideAll === true || item.hideFace === true)
  ));
  const approvedWeapons = approvedIds('weapons');
  const weapon = select(template.weapons.filter((id) => approvedWeapons.has(id)), random);
  const leftHand = selectWeighted(leftHandOptions(template, weapon, powerTier), random);
  const player = {
    species,
    bodyBuild: select(PRODUCTION_BODY_BUILDS, random).id,
    skin: selectPaletteId(palette.skins, species, 'skin', random),
    hairStyle: select(PRODUCTION_HAIR_STYLES, random).id,
    hairColor: selectPaletteId(palette.hair, species, 'hair', random),
    expression: select(PRODUCTION_EXPRESSIONS, random).id,
    faceDetail: select(PRODUCTION_FACIAL_DETAILS, random).id,
    headgear: select(headgearChoices, random).id,
    outfit: template.outfit,
    outfitTier: powerTier,
    outfitColor: selectPaletteId(palette.outfits, species, 'outfit', random),
    weapon,
    weaponTier: powerTier,
    shield: leftHand.shield,
    shieldTier: leftHand.shield === 'none' ? 'tier1' : powerTier,
    offhand: leftHand.offhand,
  };
  return { player, visibility: normalizeVisibility(player) };
}

function buildFallback(template, powerTier, palette) {
  return {
    player: {
      species: 'human',
      bodyBuild: 'classic',
      skin: palette.skins[0].id,
      hairStyle: 'short',
      hairColor: palette.hair[0].id,
      expression: 'neutral',
      faceDetail: 'none',
      headgear: 'none',
      outfit: template.outfit,
      outfitTier: powerTier,
      outfitColor: palette.outfits[0].id,
      weapon: template.defaultWeapon,
      weaponTier: powerTier,
      shield: 'none',
      shieldTier: 'tier1',
      offhand: 'none',
    },
    visibility: 'fallback-safe',
  };
}

function resultFor({
  normalizedSeed,
  template,
  powerTier,
  palette,
  generated,
  validation,
  attempts,
  fallback,
  retryReasons,
}) {
  return {
    profile: PRODUCTION_ROLL_PROFILE.id,
    seed: normalizedSeed,
    archetype: template.id,
    powerTier,
    paletteFamily: palette.id,
    attempts,
    fallback,
    player: generated.player,
    decisions: deepFreeze([
      { rule: 'archetype-first', choice: template.id },
      { rule: 'power-band', choice: powerTier },
      { rule: 'palette-family', choice: palette.id },
      {
        rule: 'class-equipment',
        weapon: generated.player.weapon,
        shield: generated.player.shield,
        offhand: generated.player.offhand,
      },
      { rule: 'visibility-normalization', choice: generated.visibility },
      {
        rule: 'silhouette-budget',
        used: validation.complexity.used,
        limit: validation.complexity.limit,
        major: validation.complexity.major,
        majorLimit: validation.complexity.majorLimit,
      },
      {
        rule: 'bounded-selection',
        attempts,
        limit: PRODUCTION_ROLL_MAX_ATTEMPTS,
        fallback,
        retryReasons: [...retryReasons],
      },
    ]),
  };
}

export function rollProductionPlayer(seed) {
  const normalizedSeed = normalizeProductionRollSeed(seed);
  const random = seededRandom(normalizedSeed);
  const template = select(PRODUCTION_CLASS_TEMPLATES, random);
  const powerTier = select(PRODUCTION_OUTFIT_TIERS, random).id;
  const palette = select(PRODUCTION_PALETTE_FAMILIES, random);
  const retryReasons = new Set();
  const context = {
    archetype: template.id,
    powerTier,
    paletteFamily: palette.id,
  };

  for (let attempts = 1; attempts <= PRODUCTION_ROLL_MAX_ATTEMPTS; attempts += 1) {
    const generated = buildCandidate(template, powerTier, palette, random);
    const validation = validateProductionPlayer(generated.player, context);
    if (validation.valid) {
      return resultFor({
        normalizedSeed,
        template,
        powerTier,
        palette,
        generated,
        validation,
        attempts,
        fallback: false,
        retryReasons,
      });
    }
    for (const reason of validation.reasons) retryReasons.add(reason);
  }

  const generated = buildFallback(template, powerTier, palette);
  const validation = validateProductionPlayer(generated.player, context);
  if (!validation.valid) throw new Error(`Invalid ${PRODUCTION_ROLL_PROFILE.id} fallback`);
  return resultFor({
    normalizedSeed,
    template,
    powerTier,
    palette,
    generated,
    validation,
    attempts: PRODUCTION_ROLL_MAX_ATTEMPTS,
    fallback: true,
    retryReasons,
  });
}
