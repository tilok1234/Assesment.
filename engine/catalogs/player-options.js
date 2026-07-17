// Player-facing appearance and equipment catalogs.

export const SKINS = [
  { id: 'pale',  name: 'Pale',  c: ['#f4d1a4', '#d9a06b'] },
  { id: 'peach', name: 'Peach', c: ['#eab98a', '#c98a56'] },
  { id: 'tan',   name: 'Tan',   c: ['#d29a62', '#a86e3f'] },
  { id: 'brown', name: 'Brown', c: ['#a06a42', '#7a4b2c'] },
  { id: 'deep',  name: 'Deep',  c: ['#6f452c', '#4f2f1e'] },
  { id: 'orc',   name: 'Orc',   c: ['#6cb54e', '#4a8b36'] },
];
export const HAIR_COLORS = [
  { id: 'black',  name: 'Black',  c: ['#2e2e38', '#1c1c24'] },
  { id: 'brown',  name: 'Brown',  c: ['#6b4327', '#4a2c18'] },
  { id: 'blonde', name: 'Blonde', c: ['#e8c15a', '#c39434'] },
  { id: 'ginger', name: 'Ginger', c: ['#c85f30', '#96401e'] },
  { id: 'white',  name: 'White',  c: ['#e6e6e6', '#b4bac4'] },
  { id: 'blue',   name: 'Blue',   c: ['#4a6fd4', '#31509f'] },
  { id: 'pink',   name: 'Pink',   c: ['#e878a8', '#bc4f7f'] },
];
export const HAIR_STYLES = [
  { id: 'bald',     name: 'Bald' },
  { id: 'short',    name: 'Short' },
  { id: 'spiky',    name: 'Spiky' },
  { id: 'bowl',     name: 'Bowl' },
  { id: 'long',     name: 'Long' },
  { id: 'ponytail', name: 'Ponytail' },
  { id: 'mohawk',   name: 'Mohawk' },
];
export const FACIAL_DETAILS = [
  { id: 'none',     name: 'None' },
  { id: 'beard',    name: 'Beard' },
  { id: 'mustache', name: 'Mustache' },
  { id: 'scar',     name: 'Scar' },
  { id: 'eyepatch', name: 'Eyepatch' },
  { id: 'glasses',  name: 'Glasses' },
  { id: 'blush',    name: 'Blush' },
  { id: 'warpaint', name: 'War paint' },
];
export const HEADGEAR = [
  { id: 'none',     name: 'None' },
  { id: 'cap',      name: 'Cap' },
  { id: 'helm',     name: 'Helm' },
  { id: 'fullhelm', name: 'Full helm', hideAll: true },
  { id: 'hood',     name: 'Hood', hideTop: true, shade: true },
  { id: 'crown',    name: 'Crown' },
  { id: 'wizard',   name: 'Wizard hat', hideTop: true },
  { id: 'horns',    name: 'Horned helm', hideTop: true },
];
export const OUTFITS = [
  { id: 'tunic',   name: 'Tunic' },
  { id: 'leather', name: 'Leather' },
  { id: 'plate',   name: 'Plate' },
  { id: 'robe',    name: 'Robe' },
  { id: 'cape',    name: 'Caped hero' },
];
export const OUTFIT_COLORS = [
  { id: 'crimson',  name: 'Crimson',  c: ['#c23a3a', '#8c2626'] },
  { id: 'royal',    name: 'Royal',    c: ['#3b62c4', '#27448f'] },
  { id: 'forest',   name: 'Forest',   c: ['#3f8f4f', '#2a6638'] },
  { id: 'purple',   name: 'Purple',   c: ['#7b4fb5', '#57357f'] },
  { id: 'umber',    name: 'Umber',    c: ['#7d5636', '#5a3c24'] },
  { id: 'teal',     name: 'Teal',     c: ['#2f9c98', '#1f6f6d'] },
  { id: 'charcoal', name: 'Charcoal', c: ['#4a4e5a', '#33363f'] },
];
export const WEAPONS = [
  { id: 'none',       name: 'None',       category: 'none' },
  { id: 'sword',      name: 'Sword',      category: 'blade',   tier2Name: 'Runeblade',          tier3Name: 'Starforged Blade' },
  { id: 'greatsword', name: 'Greatsword', category: 'blade',   tier2Name: 'Titan Greatsword',   tier3Name: 'Worldsplitter' },
  { id: 'scimitar',   name: 'Scimitar',   category: 'blade',   tier2Name: 'Sunfang',            tier3Name: 'Solar Crescent' },
  { id: 'rapier',     name: 'Rapier',     category: 'blade',   tier2Name: 'Royal Thorn',        tier3Name: 'Crownpiercer' },
  { id: 'dagger',     name: 'Dagger',     category: 'blade',   tier2Name: 'Shadowfang',         tier3Name: 'Nightshard' },
  { id: 'axe',        name: 'Axe',        category: 'blade',   tier2Name: 'Twinhead Axe',       tier3Name: 'Stormcleaver' },
  { id: 'mace',       name: 'Mace',       category: 'blunt',   tier2Name: 'Morning Star',       tier3Name: 'Comet Star' },
  { id: 'warhammer',  name: 'Warhammer',  category: 'blunt',   tier2Name: 'Runic Maul',         tier3Name: 'Worldbreaker' },
  { id: 'spear',      name: 'Spear',      category: 'polearm', tier2Name: 'Dragon Spear',       tier3Name: 'Wyrmspike' },
  { id: 'club',       name: 'Club',       category: 'blunt',   tier2Name: 'Ironwood Crusher',   tier3Name: 'Titanbone Crusher' },
  { id: 'bow',        name: 'Bow',        category: 'ranged',  tier2Name: 'Kingsguard Warbow',  tier3Name: 'Celestial Longbow' },
  { id: 'crossbow',   name: 'Crossbow',   category: 'ranged',  tier2Name: 'Siege Arbalest',     tier3Name: 'Dragonfire Ballista' },
  { id: 'staff',      name: 'Staff',      category: 'magic',   tier2Name: 'Archmage Staff',     tier3Name: 'Astral Scepter' },
  { id: 'wand',       name: 'Wand',       category: 'magic',   tier2Name: 'Crystal Wand',       tier3Name: 'Prismatic Wand' },
  { id: 'spellbook',  name: 'Spellbook',  category: 'magic',   tier2Name: 'Ancient Grimoire',   tier3Name: 'Codex Eternal' },
];
export const WEAPON_TIERS = [
  { id: 'tier1', name: 'Tier 1' },
  { id: 'tier2', name: 'Tier 2' },
  { id: 'tier3', name: 'Tier 3' },
];
export const SHIELDS = [
  { id: 'none',    name: 'None' },
  { id: 'round',   name: 'Round' },
  { id: 'kite',    name: 'Kite' },
  { id: 'buckler', name: 'Buckler' },
];
