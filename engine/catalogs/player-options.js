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
  { id: 'sword',      name: 'Sword',      category: 'blade',   tier2Name: 'Runeblade',          tier3Name: 'Starforged Blade',    tier4Name: 'Dawnreaver',            tier5Name: "Eternity's End" },
  { id: 'greatsword', name: 'Greatsword', category: 'blade',   tier2Name: 'Titan Greatsword',   tier3Name: 'Worldsplitter',       tier4Name: 'Colossus Edge',         tier5Name: 'The Last Horizon' },
  { id: 'scimitar',   name: 'Scimitar',   category: 'blade',   tier2Name: 'Sunfang',            tier3Name: 'Solar Crescent',      tier4Name: 'Eclipse Talon',         tier5Name: 'Sun-Eater Crescent' },
  { id: 'rapier',     name: 'Rapier',     category: 'blade',   tier2Name: 'Royal Thorn',        tier3Name: 'Crownpiercer',        tier4Name: 'Empyrean Needle',       tier5Name: 'Fatepiercer' },
  { id: 'dagger',     name: 'Dagger',     category: 'blade',   tier2Name: 'Shadowfang',         tier3Name: 'Nightshard',          tier4Name: 'Voidfang',               tier5Name: "Oblivion's Kiss" },
  { id: 'axe',        name: 'Axe',        category: 'blade',   tier2Name: 'Twinhead Axe',       tier3Name: 'Stormcleaver',        tier4Name: 'Tempest Executioner',   tier5Name: 'Heavenrend' },
  { id: 'mace',       name: 'Mace',       category: 'blunt',   tier2Name: 'Morning Star',       tier3Name: 'Comet Star',          tier4Name: 'Nova Star',              tier5Name: 'Supernova' },
  { id: 'warhammer',  name: 'Warhammer',  category: 'blunt',   tier2Name: 'Runic Maul',         tier3Name: 'Worldbreaker',        tier4Name: 'Godfall Maul',           tier5Name: 'Endbringer' },
  { id: 'spear',      name: 'Spear',      category: 'polearm', tier2Name: 'Dragon Spear',       tier3Name: 'Wyrmspike',           tier4Name: 'World Serpent Pike',    tier5Name: 'Axis of Creation' },
  { id: 'club',       name: 'Club',       category: 'blunt',   tier2Name: 'Ironwood Crusher',   tier3Name: 'Titanbone Crusher',   tier4Name: 'Behemoth Spire',         tier5Name: 'Worldroot Cataclysm' },
  { id: 'bow',        name: 'Bow',        category: 'ranged',  tier2Name: 'Kingsguard Warbow',  tier3Name: 'Celestial Longbow',   tier4Name: 'Seraphim Greatbow',     tier5Name: 'Wings of Genesis' },
  { id: 'crossbow',   name: 'Crossbow',   category: 'ranged',  tier2Name: 'Siege Arbalest',     tier3Name: 'Dragonfire Ballista', tier4Name: 'Wyrmfire Repeater',      tier5Name: 'Apocalypse Engine' },
  { id: 'staff',      name: 'Staff',      category: 'magic',   tier2Name: 'Archmage Staff',     tier3Name: 'Astral Scepter',      tier4Name: 'Staff of the Firmament', tier5Name: 'Pillar of Eternity' },
  { id: 'wand',       name: 'Wand',       category: 'magic',   tier2Name: 'Crystal Wand',       tier3Name: 'Prismatic Wand',      tier4Name: 'Reality Needle',         tier5Name: 'Singularity' },
  { id: 'spellbook',  name: 'Spellbook',  category: 'magic',   tier2Name: 'Ancient Grimoire',   tier3Name: 'Codex Eternal',       tier4Name: 'Omniscient Codex',       tier5Name: 'The Final Testament' },
];
export const WEAPON_TIERS = [
  { id: 'tier1', name: 'Tier 1' },
  { id: 'tier2', name: 'Tier 2' },
  { id: 'tier3', name: 'Tier 3' },
  { id: 'tier4', name: 'Tier 4' },
  { id: 'tier5', name: 'Tier 5' },
];
export const SHIELDS = [
  { id: 'none',    name: 'None' },
  { id: 'round',   name: 'Round' },
  { id: 'kite',    name: 'Kite' },
  { id: 'buckler', name: 'Buckler' },
  { id: 'heater',  name: 'Heater' },
  { id: 'tower',   name: 'Tower' },
  { id: 'oval',    name: 'Oval' },
  { id: 'bone',    name: 'Bone' },
  { id: 'arcane',  name: 'Arcane' },
];
