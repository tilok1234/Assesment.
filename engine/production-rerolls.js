import {
  BODY_BUILDS,
  EXPRESSIONS,
  FACIAL_DETAILS,
  HAIR_COLORS,
  HAIR_STYLES,
  HEADGEAR,
  OFFHANDS,
  OUTFIT_COLORS,
  OUTFIT_TIERS,
  SHIELDS,
  SKINS,
  SPECIES,
  WEAPONS,
} from './catalogs.js';
import {
  normalizeProductionRollSeed,
  PRODUCTION_ROLL_PROFILE,
  validateProductionPlayer,
} from './production-rolls.js';

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function cloneValue(value) {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [
    key,
    cloneValue(child),
  ]));
}

export const PRODUCTION_COMPATIBLE_REROLL_POLICY = deepFreeze({
  id: 'production-compatible-reroll-v1',
  version: 1,
  profile: PRODUCTION_ROLL_PROFILE.id,
});

function rerollCategory(id, name, fields) {
  return deepFreeze({ id, name, fields });
}

export const PRODUCTION_COMPATIBLE_REROLL_CATEGORIES = Object.freeze([
  rerollCategory('species', 'Species', ['species']),
  rerollCategory('bodyBuild', 'Body build', ['bodyBuild']),
  rerollCategory('skin', 'Skin', ['skin']),
  rerollCategory('hairStyle', 'Hair style', ['hairStyle']),
  rerollCategory('hairColor', 'Hair color', ['hairColor']),
  rerollCategory('expression', 'Expression', ['expression']),
  rerollCategory('faceDetail', 'Facial detail', ['faceDetail']),
  rerollCategory('headgear', 'Headgear', ['headgear']),
  rerollCategory('outfitColor', 'Outfit color', ['outfitColor']),
  rerollCategory('weapon', 'Weapon', ['weapon', 'weaponTier']),
  rerollCategory('shield', 'Shield', ['shield', 'shieldTier']),
  rerollCategory('offhand', 'Off-hand item', ['offhand']),
  rerollCategory('leftHand', 'Left-hand equipment', ['shield', 'shieldTier', 'offhand']),
  rerollCategory('powerTier', 'Equipment power tier', [
    'outfitTier',
    'weaponTier',
    'shieldTier',
  ]),
]);

const CATEGORY_BY_ID = new Map(PRODUCTION_COMPATIBLE_REROLL_CATEGORIES.map((category) => [
  category.id,
  category,
]));

const PLAYER_FIELDS = Object.freeze([
  'species',
  'bodyBuild',
  'skin',
  'hairStyle',
  'hairColor',
  'expression',
  'faceDetail',
  'headgear',
  'outfit',
  'outfitTier',
  'outfitColor',
  'weapon',
  'weaponTier',
  'shield',
  'shieldTier',
  'offhand',
]);

const SIMPLE_CATALOGS = Object.freeze({
  species: SPECIES,
  bodyBuild: BODY_BUILDS,
  skin: SKINS,
  hairStyle: HAIR_STYLES,
  hairColor: HAIR_COLORS,
  expression: EXPRESSIONS,
  faceDetail: FACIAL_DETAILS,
  headgear: HEADGEAR,
  outfitColor: OUTFIT_COLORS,
  weapon: WEAPONS,
  shield: SHIELDS,
  offhand: OFFHANDS,
});

const UINT32_RANGE = 0x100000000;

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

function plainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function copyPlayer(player) {
  const copy = {};
  for (const field of PLAYER_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(player, field)) {
      copy[field] = cloneValue(player[field]);
    }
  }
  if (Object.prototype.hasOwnProperty.call(player, 'palette')) {
    copy.palette = cloneValue(player.palette);
  }
  return copy;
}

function copyContext(context) {
  return {
    archetype: context.archetype,
    powerTier: context.powerTier,
    paletteFamily: context.paletteFamily,
  };
}

function categorySignature(category, player, context) {
  return JSON.stringify({
    values: category.fields.map((field) => player[field]),
    powerTier: category.id === 'powerTier' ? context.powerTier : undefined,
  });
}

function simpleCandidate(category, id, player, context) {
  const patch = { [category.id]: id };
  if (category.id === 'weapon') {
    patch.weaponTier = id === 'none' ? 'tier1' : context.powerTier;
  }
  if (category.id === 'shield') {
    patch.shieldTier = id === 'none' ? 'tier1' : context.powerTier;
  }
  return {
    id,
    player: { ...player, ...patch },
    context: { ...context },
  };
}

function simpleCandidates(category, player, context) {
  return SIMPLE_CATALOGS[category.id].map((entry) => (
    simpleCandidate(category, entry.id, player, context)
  ));
}

function leftHandCandidates(player, context) {
  return [
    {
      id: 'none',
      player: {
        ...player,
        shield: 'none',
        shieldTier: 'tier1',
        offhand: 'none',
      },
      context: { ...context },
    },
    ...SHIELDS
      .filter((entry) => entry.id !== 'none')
      .map((entry) => ({
        id: `shield:${entry.id}`,
        player: {
          ...player,
          shield: entry.id,
          shieldTier: context.powerTier,
          offhand: 'none',
        },
        context: { ...context },
      })),
    ...OFFHANDS
      .filter((entry) => entry.id !== 'none')
      .map((entry) => ({
        id: `offhand:${entry.id}`,
        player: {
          ...player,
          shield: 'none',
          shieldTier: 'tier1',
          offhand: entry.id,
        },
        context: { ...context },
      })),
  ];
}

function powerTierCandidates(player, context) {
  return OUTFIT_TIERS.map((entry) => ({
    id: entry.id,
    player: {
      ...player,
      outfitTier: entry.id,
      weaponTier: player.weapon === 'none' ? 'tier1' : entry.id,
      shieldTier: player.shield === 'none' ? 'tier1' : entry.id,
    },
    context: { ...context, powerTier: entry.id },
  }));
}

function candidatePool(category, player, context) {
  if (category.id === 'leftHand') return leftHandCandidates(player, context);
  if (category.id === 'powerTier') return powerTierCandidates(player, context);
  return simpleCandidates(category, player, context);
}

function changedFields(before, after) {
  return PLAYER_FIELDS.filter((field) => (
    JSON.stringify(before[field]) !== JSON.stringify(after[field])
  ));
}

function resultFor({
  normalizedSeed,
  category,
  beforePlayer,
  beforeContext,
  beforeValidation,
  candidates,
  selected,
}) {
  const player = copyPlayer(selected?.player || beforePlayer);
  const context = deepFreeze(copyContext(selected?.context || beforeContext));
  const fields = selected ? changedFields(beforePlayer, player) : [];
  return {
    policy: PRODUCTION_COMPATIBLE_REROLL_POLICY.id,
    profile: PRODUCTION_ROLL_PROFILE.id,
    seed: normalizedSeed,
    category: category.id,
    changed: Boolean(selected),
    player,
    context,
    audit: deepFreeze({
      reason: selected ? 'compatible-selection' : 'no-compatible-alternative',
      candidateCount: candidates.length,
      candidates: candidates.map((candidate) => candidate.id),
      selected: selected?.id || null,
      changedFields: fields,
      beforeValid: beforeValidation.valid,
      beforeReasons: [...beforeValidation.reasons],
    }),
  };
}

export function rerollProductionPlayerCategory(player, context, categoryId, seed) {
  if (!plainObject(player)) throw new TypeError('player must be an object');
  if (!plainObject(context)) throw new TypeError('context must be an object');
  const category = CATEGORY_BY_ID.get(categoryId);
  if (!category) throw new RangeError(`Unknown Production reroll category: ${categoryId}`);

  const beforePlayer = copyPlayer(player);
  const beforeContext = copyContext(context);
  const beforeValidation = validateProductionPlayer(beforePlayer, beforeContext);
  const currentSignature = categorySignature(category, beforePlayer, beforeContext);
  const candidates = candidatePool(category, beforePlayer, beforeContext)
    .filter((candidate) => (
      categorySignature(category, candidate.player, candidate.context) !== currentSignature
    ))
    .filter((candidate) => validateProductionPlayer(candidate.player, candidate.context).valid);
  const normalizedSeed = normalizeProductionRollSeed(seed);
  const random = seededRandom(
    `${PRODUCTION_COMPATIBLE_REROLL_POLICY.id}:${category.id}:${normalizedSeed}`,
  );
  const selected = candidates.length
    ? candidates[Math.floor(random() * candidates.length)]
    : null;

  return resultFor({
    normalizedSeed,
    category,
    beforePlayer,
    beforeContext,
    beforeValidation,
    candidates,
    selected,
  });
}
