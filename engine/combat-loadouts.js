import { COMBAT_EFFECTS, ENEMIES } from './catalogs.js';

export const COMBAT_LOADOUT_FORMAT = '8-bit-sprite-assembler-combat-loadout';
export const COMBAT_LOADOUT_VERSION = 1;

export const COMBAT_LOADOUT_SLOTS = [
  { id: 'trail', name: 'Weapon trail', category: 'trails' },
  { id: 'projectile', name: 'Projectile', category: 'projectiles' },
  { id: 'impact', name: 'Impact', category: 'impacts' },
  { id: 'status', name: 'Status overlay', category: 'statuses' },
];

export const DEFAULT_COMBAT_LOADOUT = Object.freeze({
  trail: 'auto',
  projectile: 'auto',
  impact: 'auto',
  status: 'auto',
});

const effectCategories = new Map(COMBAT_EFFECTS.map((category) => [category.id, category]));
const heavyEnemyFamilies = new Set([
  'bear', 'boar', 'crocodile', 'cyclops', 'gargoyle', 'golem', 'minotaur', 'mole',
  'ogre', 'snail', 'treant', 'troll', 'turtle',
]);
const venomEnemyFamilies = new Set([
  'carniplant', 'centipede', 'frog', 'scorpion', 'shroom', 'slime', 'snake', 'spider', 'wasp',
]);
const spectralEnemyFamilies = new Set([
  'anglerfish', 'eye', 'ghost', 'jellyfish', 'moth', 'octopus',
]);
const clawEnemyFamilies = new Set([
  'bat', 'beetle', 'bigcat', 'crab', 'drake', 'griffin', 'harpy', 'lizardfolk',
  'mantis', 'porcupine', 'ratfolk', 'wolf', 'worm',
]);

function profile(trail = null, projectile = null, impact = null, status = null) {
  return { trail, projectile, impact, status };
}

function weaponProfile(weapon, shield = 'none') {
  if (weapon === 'none') {
    return shield !== 'none'
      ? profile('shield-block', null, 'armor-impact')
      : profile();
  }
  if (['sword', 'greatsword', 'scimitar'].includes(weapon)) return profile('sword-slash', null, 'sparks');
  if (weapon === 'dagger') return profile('sword-slash', null, 'blood-hit');
  if (['rapier', 'spear'].includes(weapon)) return profile('spear-thrust', null, 'blood-hit');
  if (weapon === 'axe') return profile('axe-cleave', null, 'blood-hit');
  if (['mace', 'warhammer', 'club'].includes(weapon)) return profile('hammer-smash', null, 'armor-impact');
  if (weapon === 'bow') return profile(null, 'arrow', 'blood-hit');
  if (weapon === 'crossbow') return profile(null, 'crossbow-bolt', 'armor-impact');
  if (weapon === 'staff') return profile(null, 'fireball', 'explosion');
  if (weapon === 'wand') return profile(null, 'holy-orb', 'arcane-burst');
  if (weapon === 'spellbook') return profile(null, 'shadow-shot', 'arcane-burst');
  return profile('sword-slash', null, 'sparks');
}

function keywordEnemyProfile(familyId, variantId) {
  const key = `${familyId}-${variantId}`;
  if (/(magma|ember|fire|infernal|lava|sun)/.test(key)) return profile(null, 'fireball', 'explosion');
  if (/(frost|ice|crystal|snow|aqua)/.test(key)) return profile(null, 'ice-shard', 'arcane-burst');
  if (/(venom|poison|rot|plague|swamp|moss)/.test(key)) return profile(null, 'poison-glob', 'blood-hit');
  if (/(shadow|cursed|void|demon|spectral|death|bone)/.test(key)) return profile(null, 'shadow-shot', 'arcane-burst');
  return null;
}

function enemyProfile(spec) {
  const family = ENEMIES.find((item) => item.id === spec.family) || ENEMIES[0];
  const variant = family.variants.find((item) => item.id === spec.variant) || family.variants[0];
  const elemental = keywordEnemyProfile(family.id, variant.id);
  if (elemental) return elemental;
  if (variant.weapon && variant.weapon !== 'none') return weaponProfile(variant.weapon, variant.shield || 'none');
  if (variant.shield && variant.shield !== 'none') return weaponProfile('none', variant.shield);
  if (venomEnemyFamilies.has(family.id)) return profile(null, 'poison-glob', 'blood-hit');
  if (spectralEnemyFamilies.has(family.id)) return profile(null, 'shadow-shot', 'arcane-burst');
  if (heavyEnemyFamilies.has(family.id)) return profile('hammer-smash', null, 'armor-impact');
  if (clawEnemyFamilies.has(family.id)) return profile('axe-cleave', null, 'blood-hit');
  if (family.id === 'elemental') return profile(null, 'fireball', 'explosion');
  if (family.id === 'puppet') return profile('sword-slash', null, 'sparks');
  if (family.id === 'scarecrow') return profile('spear-thrust', null, 'dust-puff');
  if (family.id === 'mimic') return profile('hammer-smash', null, 'sparks');
  return profile('sword-slash', null, 'blood-hit');
}

function hasEffect(categoryId, effectId) {
  return effectCategories.get(categoryId)?.effects.some((effect) => effect.id === effectId) || false;
}

export function sanitizeCombatLoadout(loadout = {}) {
  return Object.fromEntries(COMBAT_LOADOUT_SLOTS.map((slot) => {
    const value = loadout?.[slot.id];
    const selected = value === 'auto' || value === 'none' || hasEffect(slot.category, value)
      ? value
      : DEFAULT_COMBAT_LOADOUT[slot.id];
    return [slot.id, selected];
  }));
}

export function defaultCombatLoadout(spec = {}) {
  if (spec.kind === 'enemy') return enemyProfile(spec);
  if (spec.kind === 'player') return weaponProfile(spec.weapon || 'none', spec.shield || 'none');
  return profile();
}

export function resolveCombatLoadout(spec = {}, loadout = DEFAULT_COMBAT_LOADOUT) {
  const selections = sanitizeCombatLoadout(loadout);
  const defaults = defaultCombatLoadout(spec);
  const slots = COMBAT_LOADOUT_SLOTS.map((slot) => {
    const selection = selections[slot.id];
    const effectId = selection === 'auto' ? defaults[slot.id] : selection === 'none' ? null : selection;
    const category = effectCategories.get(slot.category);
    const effect = effectId ? category?.effects.find((item) => item.id === effectId) : null;
    return {
      slot: slot.id,
      name: slot.name,
      category: slot.category,
      selection,
      effect: effect?.id || null,
      effectName: effect?.name || null,
      file: effect ? `effects/${slot.category}/${effect.id}.png` : null,
    };
  });
  return { selections, defaults, slots };
}

export function combatLoadoutEffectSpecs(spec = {}, loadout = DEFAULT_COMBAT_LOADOUT) {
  return resolveCombatLoadout(spec, loadout).slots
    .filter((slot) => slot.effect)
    .map((slot) => ({ kind: 'effect', category: slot.category, effect: slot.effect }));
}
